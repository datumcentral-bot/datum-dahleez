/**
 * DATUM DAHLEEZ Admin Engine
 * localStorage-backed admin for products, materials, rules, customers, orders
 */
class AdminEngine {
    constructor() {
        this.dataLoader = new DataLoader();
        this.storageKey = 'eis_admin_data';
    }

    getAdminData() {
        try {
            return JSON.parse(localStorage.getItem(this.storageKey) || '{}');
        } catch (e) {
            return {};
        }
    }

    saveAdminData(data) {
        localStorage.setItem(this.storageKey, JSON.stringify(data));
    }

    getProducts() {
        return this.getAdminData().products || [];
    }

    saveProduct(product) {
        const data = this.getAdminData();
        if (!data.products) data.products = [];
        const idx = data.products.findIndex(p => p.id === product.id);
        if (idx >= 0) {
            data.products[idx] = { ...data.products[idx], ...product };
        } else {
            data.products.push(product);
        }
        this.saveAdminData(data);
    }

    deleteProduct(productId) {
        const data = this.getAdminData();
        if (data.products) {
            data.products = data.products.filter(p => p.id !== productId);
        }
        this.saveAdminData(data);
    }

    getMaterials() {
        try {
            const raw = localStorage.getItem('eis_admin_materials');
            return raw ? JSON.parse(raw) : [];
        } catch (e) {
            return [];
        }
    }

    saveMaterial(material) {
        const materials = this.getMaterials();
        const idx = materials.findIndex(m => m.id === material.id);
        if (idx >= 0) {
            materials[idx] = { ...materials[idx], ...material };
        } else {
            materials.push(material);
        }
        localStorage.setItem('eis_admin_materials', JSON.stringify(materials));
    }

    getCustomers() {
        try {
            const raw = localStorage.getItem('eis_admin_customers');
            return raw ? JSON.parse(raw) : [];
        } catch (e) {
            return [];
        }
    }

    saveCustomer(customer) {
        const customers = this.getCustomers();
        const idx = customers.findIndex(c => c.id === customer.id);
        if (idx >= 0) {
            customers[idx] = { ...customers[idx], ...customer, updatedAt: new Date().toISOString() };
        } else {
            customers.push({ ...customer, createdAt: new Date().toISOString() });
        }
        localStorage.setItem('eis_admin_customers', JSON.stringify(customers));
    }

    getOrders() {
        try {
            const raw = localStorage.getItem('eis_admin_orders');
            return raw ? JSON.parse(raw) : [];
        } catch (e) {
            return [];
        }
    }

    saveOrder(order) {
        const orders = this.getOrders();
        orders.push({ ...order, createdAt: new Date().toISOString() });
        localStorage.setItem('eis_admin_orders', JSON.stringify(orders));
    }

    getAnalytics() {
        const sessions = JSON.parse(localStorage.getItem('eis_sessions_history') || '[]');
        const customers = this.getCustomers();
        const orders = this.getOrders();
        const products = this.getProducts();
        
        const emotionCounts = {};
        const spaceCounts = {};
        const budgetCounts = {};
        
        sessions.forEach(s => {
            emotionCounts[s.emotion || 'unknown'] = (emotionCounts[s.emotion || 'unknown'] || 0) + 1;
            spaceCounts[s.space || 'unknown'] = (spaceCounts[s.space || 'unknown'] || 0) + 1;
            budgetCounts[s.budget || 'unknown'] = (budgetCounts[s.budget || 'unknown'] || 0) + 1;
        });

        return {
            totalSessions: sessions.length,
            totalCustomers: customers.length,
            totalOrders: orders.length,
            totalProducts: products.length,
            topEmotions: Object.entries(emotionCounts).sort((a, b) => b[1] - a[1]).slice(0, 5),
            topSpaces: Object.entries(spaceCounts).sort((a, b) => b[1] - a[1]).slice(0, 5),
            budgetDistribution: Object.entries(budgetCounts).sort((a, b) => b[1] - a[1]),
            recentOrders: orders.slice(-10).reverse()
        };
    }

    getRules() {
        try {
            const raw = localStorage.getItem('eis_admin_rules');
            if (raw) return JSON.parse(raw);
        } catch (e) { /* ignore */ }
        return [
            { id: 'RULE_CALM_BEDROOM', emotions: ['calm', 'relaxed'], spaces: ['bedroom'], collections: ['linen', 'minimalist'], materials: ['wood', 'linen'], lighting: ['warm-led', 'dimmable'] },
            { id: 'RULE_ENERGETIC_LIVING', emotions: ['energetic', 'social'], spaces: ['living-room'], collections: ['modern', 'bold'], materials: ['concrete', 'metal'], lighting: ['cool-led', 'accent'] }
        ];
    }

    saveRule(rule) {
        const rules = this.getRules();
        const idx = rules.findIndex(r => r.id === rule.id);
        if (idx >= 0) {
            rules[idx] = { ...rules[idx], ...rule };
        } else {
            rules.push(rule);
        }
        localStorage.setItem('eis_admin_rules', JSON.stringify(rules));
        return rules;
    }

    deleteRule(ruleId) {
        const rules = this.getRules().filter(r => r.id !== ruleId);
        localStorage.setItem('eis_admin_rules', JSON.stringify(rules));
    }

    exportCSV(data, filename) {
        if (!data || data.length === 0) {
            alert('No data to export.');
            return;
        }
        const headers = Object.keys(data[0]);
        const csv = [
            headers.join(','),
            ...data.map(row => headers.map(h => `"${String(row[h] || '').replace(/"/g, '""')}"`).join(','))
        ].join('\n');
        
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
    }
}

window.AdminEngine = AdminEngine;
