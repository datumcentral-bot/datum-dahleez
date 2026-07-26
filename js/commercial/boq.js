/**
 * DATUM DAHLEEZ Commercial Engine
 * BOQ Generator - Bill of Quantities trade-grouped with unit rates
 */

class BOQGenerator {
    constructor(options = {}) {
        this.dataLoader = options.dataLoader || new DataLoader();
        this.trades = ['Civil', 'MEP', 'Joinery', 'FF&E', 'Lighting', 'Acoustic', 'Smart Building', 'Flooring', 'Walls', 'Sanitary'];
    }

    async loadProducts() {
        return await this.dataLoader.load('products', '../data/products.json');
    }

    categorizeByTrade(product) {
        const category = (product.category || '').toLowerCase();
        const subcategory = (product.subcategory || '').toLowerCase();
        
        if (category.includes('lighting') || subcategory.includes('lighting') || subcategory.includes('lamp')) return 'Lighting';
        if (category.includes('acoustic') || subcategory.includes('acoustic')) return 'Acoustic';
        if (category.includes('smart') || subcategory.includes('automation') || category.includes('iot')) return 'Smart Building';
        if (category.includes('flooring') || subcategory.includes('flooring') || subcategory.includes('carpet')) return 'Flooring';
        if (category.includes('wall') || subcategory.includes('paint') || subcategory.includes('finish')) return 'Walls';
        if (category.includes('bathroom') || subcategory.includes('sanitary') || subcategory.includes('fitting')) return 'Sanitary';
        if (category.includes('kitchen') || subcategory.includes('cabinet') || subcategory.includes('joinery')) return 'Joinery';
        if (category.includes('furniture') || subcategory.includes('seating') || category.includes('bed')) return 'FF&E';
        if (category.includes('hvac') || category.includes('air') || category.includes('ventilation')) return 'MEP';
        if (category.includes('electrical') || category.includes('switch') || category.includes('cable')) return 'MEP';
        return 'FF&E';
    }

    async generateBOQ(state, lineItems) {
        const products = await this.loadProducts();
        const productMap = new Map(products.map(p => [p.id, p]));
        
        const tradeGroups = {};
        this.trades.forEach(t => { tradeGroups[t] = []; });
        tradeGroups['Other'] = [];

        let totalAmount = 0;

        for (const item of lineItems) {
            const product = productMap.get(item.productId);
            if (!product) continue;
            
            const trade = this.categorizeByTrade(product);
            const unitPrice = this.resolvePrice(product, state.metadata?.budgetTier);
            const amount = unitPrice * item.quantity;
            totalAmount += amount;
            
            tradeGroups[trade].push({
                productId: item.productId,
                name: product.name,
                category: product.category,
                unit: product.specifications?.dimensions || 'pc',
                quantity: item.quantity,
                unitPrice,
                amount,
                notes: item.notes || ''
            });
        }

        const boq = {
            project: state.metadata?.selectedSpace || state.metadata?.selectedCategory || 'Unknown',
            generatedAt: new Date().toISOString(),
            trades: Object.entries(tradeGroups)
                .filter(([, items]) => items.length > 0)
                .map(([trade, items]) => ({
                    trade,
                    items,
                    tradeTotal: items.reduce((sum, i) => sum + i.amount, 0)
                })),
            grandTotal: totalAmount,
            currency: 'AED'
        };

        return boq;
    }

    resolvePrice(product, budgetTier) {
        if (product.priceRange && product.priceRange.min && product.priceRange.max) {
            const tierRanges = {
                comfort: [0.5, 0.7],
                premium: [0.7, 0.85],
                luxury: [0.85, 1.0],
                signature: [1.0, 1.2],
                bespoke: [1.2, 2.0]
            };
            const [minMult, maxMult] = tierRanges[budgetTier] || [0.5, 1.0];
            return Math.round(((product.priceRange.min * minMult) + (product.priceRange.max * maxMult)) / 2);
        }
        return 0;
    }

    renderBOQHTML(boq) {
        return `
            <div class="boq" style="background: var(--bg); color: var(--text); font-family: 'Inter', sans-serif; max-width: 1000px; margin: 0 auto; padding: 2rem;">
                <div class="boq__header" style="border-bottom: 2px solid var(--gold); padding-bottom: 1.5rem; margin-bottom: 2rem;">
                    <h1 class="boq__title display" style="font-size: 2rem; margin: 0;">Bill of Quantities</h1>
                    <div class="boq__meta mono" style="font-size: 0.8rem; color: var(--muted); margin-top: 0.5rem;">
                        Project: ${boq.project} · Generated: ${new Date(boq.generatedAt).toLocaleDateString()}
                    </div>
                </div>
                ${boq.trades.map(trade => `
                    <div class="boq__trade" style="margin-bottom: 2rem;">
                        <h2 style="font-size: 1.1rem; color: var(--gold); margin-bottom: 0.75rem; text-transform: uppercase; letter-spacing: 0.08em;">${trade.trade}</h2>
                        <table style="width: 100%; border-collapse: collapse;">
                            <thead>
                                <tr style="border-bottom: 1px solid var(--border);">
                                    <th style="text-align: left; padding: 0.5rem 0; font-weight: 500;">Item</th>
                                    <th style="text-align: left; padding: 0.5rem 0; font-weight: 500; font-size: 0.8rem;">Category</th>
                                    <th style="text-align: center; padding: 0.5rem 0; font-weight: 500; font-size: 0.8rem;">Qty</th>
                                    <th style="text-align: right; padding: 0.5rem 0; font-weight: 500; font-size: 0.8rem;">Unit Price</th>
                                    <th style="text-align: right; padding: 0.5rem 0; font-weight: 500; font-size: 0.8rem;">Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${trade.items.map(item => `
                                    <tr style="border-bottom: 1px solid var(--border);">
                                        <td style="padding: 0.6rem 0; font-size: 0.9rem;">${item.name}${item.notes ? ' <span style="color: var(--muted); font-size: 0.75rem;">(' + item.notes + ')</span>' : ''}</td>
                                        <td style="padding: 0.6rem 0; font-size: 0.8rem; color: var(--muted);">${item.category}</td>
                                        <td style="text-align: center; padding: 0.6rem 0; font-family: 'JetBrains Mono', monospace; font-size: 0.85rem;">${item.quantity} ${item.unit}</td>
                                        <td style="text-align: right; padding: 0.6rem 0; font-family: 'JetBrains Mono', monospace; font-size: 0.85rem;">AED ${item.unitPrice.toLocaleString()}</td>
                                        <td style="text-align: right; padding: 0.6rem 0; font-family: 'JetBrains Mono', monospace; font-size: 0.85rem; color: var(--gold);">AED ${item.amount.toLocaleString()}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                        <div style="text-align: right; font-family: 'JetBrains Mono', monospace; font-size: 0.9rem; padding-top: 0.75rem; color: var(--soft-silver);">
                            ${trade.trade} Subtotal: AED ${trade.tradeTotal.toLocaleString()}
                        </div>
                    </div>
                `).join('')}
                <div class="boq__totals" style="text-align: right; font-family: 'JetBrains Mono', monospace; border-top: 2px solid var(--border); padding-top: 1.5rem;">
                    <div style="font-size: 1.25rem; font-weight: 600; color: var(--gold);">Grand Total: AED ${boq.grandTotal.toLocaleString()}</div>
                </div>
            </div>
        `;
    }
}

window.BOQGenerator = BOQGenerator;
