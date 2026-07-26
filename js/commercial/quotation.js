/**
 * DATUM DAHLEEZ Commercial Engine
 * Quotation Builder - Generates professional quotes from recommendation carts
 */

class QuotationBuilder {
    constructor(options = {}) {
        this.dataLoader = options.dataLoader || new DataLoader();
        this.quoteNumber = 1000;
        this.vatRate = 0.05;
    }

    async loadProducts() {
        return await this.dataLoader.load('products', '../data/products.json');
    }

    async buildQuote(state, lineItems) {
        const products = await this.loadProducts();
        const productMap = new Map(products.map(p => [p.id, p]));
        
        const quote = {
            quoteNumber: `DDQ-${Date.now().toString().slice(-8)}-${++this.quoteNumber}`,
            date: new Date().toISOString(),
            validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            customer: {
                space: state.metadata?.selectedSpace || state.metadata?.selectedCategory,
                emotion: state.metadata?.targetEmotion,
                budgetTier: state.metadata?.budgetTier,
                style: state.metadata?.stylePreference,
                theme: state.metadata?.theme
            },
            items: [],
            subtotal: 0,
            vat: 0,
            total: 0,
            currency: 'AED'
        };

        for (const item of lineItems) {
            const product = productMap.get(item.productId);
            if (!product) continue;
            
            const unitPrice = this.resolvePrice(product, state.metadata?.budgetTier);
            const lineTotal = unitPrice * item.quantity;
            
            quote.items.push({
                productId: item.productId,
                name: product.name,
                category: product.category,
                quantity: item.quantity,
                unitPrice,
                lineTotal,
                markup: item.markup || 0,
                notes: item.notes || ''
            });
            
            quote.subtotal += lineTotal;
        }

        quote.vat = Math.round(quote.subtotal * this.vatRate);
        quote.total = quote.subtotal + quote.vat;

        return quote;
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
            const min = product.priceRange.min * minMult;
            const max = product.priceRange.max * maxMult;
            return Math.round((min + max) / 2);
        }
        return 0;
    }

    renderQuoteHTML(quote) {
        return `
            <div class="quote" style="background: var(--bg); color: var(--text); font-family: 'Inter', sans-serif; max-width: 800px; margin: 0 auto; padding: 2rem;">
                <div class="quote__header" style="border-bottom: 2px solid var(--gold); padding-bottom: 1.5rem; margin-bottom: 2rem;">
                    <div class="quote__number mono" style="font-size: 0.75rem; color: var(--gold); letter-spacing: 0.1em; margin-bottom: 0.5rem;">${quote.quoteNumber}</div>
                    <h1 class="quote__title display" style="font-size: 2rem; margin: 0;">Quotation</h1>
                    <div class="quote__meta mono" style="font-size: 0.8rem; color: var(--muted); margin-top: 0.5rem;">
                        Date: ${new Date(quote.date).toLocaleDateString()} · Valid Until: ${new Date(quote.validUntil).toLocaleDateString()}
                    </div>
                </div>
                <div class="quote__project" style="margin-bottom: 2rem;">
                    <h2 style="font-size: 1.1rem; color: var(--gold); margin-bottom: 0.5rem;">Project</h2>
                    <p style="color: var(--soft-silver);">${quote.customer.space?.replace(/-/g, ' ') || 'TBD'} · ${quote.customer.emotion || 'N/A'} · ${quote.customer.budgetTier || 'N/A'} tier</p>
                </div>
                <table class="quote__items" style="width: 100%; border-collapse: collapse; margin-bottom: 1.5rem;">
                    <thead>
                        <tr style="border-bottom: 1px solid var(--border);">
                            <th style="text-align: left; padding: 0.75rem 0; font-weight: 500;">Item</th>
                            <th style="text-align: center; padding: 0.75rem 0; font-weight: 500;">Qty</th>
                            <th style="text-align: right; padding: 0.75rem 0; font-weight: 500;">Unit Price</th>
                            <th style="text-align: right; padding: 0.75rem 0; font-weight: 500;">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${quote.items.map(item => `
                            <tr style="border-bottom: 1px solid var(--border);">
                                <td style="padding: 0.75rem 0;">${item.name}${item.notes ? ' <span style="color: var(--muted); font-size: 0.8rem;">(' + item.notes + ')</span>' : ''}</td>
                                <td style="text-align: center; padding: 0.75rem 0; font-family: 'JetBrains Mono', monospace;">${item.quantity}</td>
                                <td style="text-align: right; padding: 0.75rem 0; font-family: 'JetBrains Mono', monospace;">AED ${item.unitPrice.toLocaleString()}</td>
                                <td style="text-align: right; padding: 0.75rem 0; font-family: 'JetBrains Mono', monospace; color: var(--gold);">AED ${item.lineTotal.toLocaleString()}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
                <div class="quote__totals" style="text-align: right; font-family: 'JetBrains Mono', monospace;">
                    <div style="padding: 0.5rem 0; color: var(--muted);">Subtotal: AED ${quote.subtotal.toLocaleString()}</div>
                    <div style="padding: 0.5rem 0; color: var(--muted);">VAT (5%): AED ${quote.vat.toLocaleString()}</div>
                    <div style="padding: 0.75rem 0; font-size: 1.25rem; font-weight: 600; color: var(--gold);">Total: AED ${quote.total.toLocaleString()}</div>
                </div>
                <div class="quote__footer" style="margin-top: 3rem; padding-top: 1.5rem; border-top: 1px solid var(--border); text-align: center; font-family: 'JetBrains Mono', monospace; font-size: 0.75rem; color: var(--muted);">
                    DATUM DAHLEEZ · quotation valid for 30 days · prices subject to final confirmation
                </div>
            </div>
        `;
    }
}

window.QuotationBuilder = QuotationBuilder;
