/**
 * Datum Dahleez Store - Payment Processing
 * Professional payment system with cash on delivery and placeholder card option
 */

class PaymentProcessor {
    constructor() {
        this.init();
    }

    init() {
        this.attachEventListeners();
    }

    attachEventListeners() {
        const checkoutBtn = document.getElementById('checkout-btn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => this.initiateCheckout());
        }
    }

    initiateCheckout() {
        const cart = JSON.parse(localStorage.getItem('datum_dahleez_cart') || '[]');
        if (cart.length === 0) {
            alert('Your cart is empty!');
            return;
        }
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const checkoutOptions = `
            <div id="checkout-modal" class="modal" style="display:flex;position:fixed;inset:0;background:rgba(0,0,0,0.8);z-index:100;align-items:center;justify-content:center;">
                <div class="modal-content" style="background:#111;border:1px solid #222;padding:2rem;max-width:500px;width:90%;border-radius:12px;">
                    <span class="close-btn" style="float:right;font-size:1.5rem;cursor:pointer;" onclick="document.getElementById('checkout-modal').remove()">&times;</span>
                    <h2 style="margin-bottom:1rem;">Checkout - Cash on Delivery</h2>
                    <p style="color:#888;margin-bottom:1.5rem;">Pay with cash when your order is delivered.</p>
                    <div style="display:flex;flex-direction:column;gap:1rem;">
                        <input type="text" id="cod-name" placeholder="Full Name *" style="padding:0.75rem;background:#0a0a0a;border:1px solid #333;border-radius:8px;color:#fff;" />
                        <input type="tel" id="cod-phone" placeholder="Phone Number *" style="padding:0.75rem;background:#0a0a0a;border:1px solid #333;border-radius:8px;color:#fff;" />
                        <input type="text" id="cod-address" placeholder="Full Address *" style="padding:0.75rem;background:#0a0a0a;border:1px solid #333;border-radius:8px;color:#fff;" />
                        <input type="text" id="cod-city" placeholder="City *" style="padding:0.75rem;background:#0a0a0a;border:1px solid #333;border-radius:8px;color:#fff;" />
                        <button class="btn" onclick="paymentProcessor.processCashOnDelivery()">Place Order - Rs. ${total.toLocaleString()}</button>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', checkoutOptions);
    }

    processCashOnDelivery(cart, total) {
        const orderId = 'DD-' + Date.now();
        const order = {
            id: orderId,
            items: cart,
            total: total,
            status: 'pending',
            paymentMethod: 'cash_on_delivery',
            createdAt: new Date().toISOString()
        };

        const orders = JSON.parse(localStorage.getItem('datum_dahleez_orders') || '[]');
        orders.push(order);
        localStorage.setItem('datum_dahleez_orders', JSON.stringify(orders));

        localStorage.removeItem('datum_dahleez_cart');

        alert(`Order placed successfully!\n\nOrder ID: ${orderId}\nTotal: Rs. ${total.toLocaleString()}\nPayment: Cash on Delivery\n\nThank you for shopping with Datum Dahleez!`);
        const modal = document.getElementById('checkout-modal');
        if (modal) modal.remove();
        window.location.reload();
    }

    processCardPayment() {
        alert('Card payment integration requires Stripe setup.\n\nFor now, please use cash on delivery.\n\nContact us for card payment setup.');
        const modal = document.getElementById('checkout-modal');
        if (modal) modal.remove();
    }

    placeOrder(cart, customer, paymentMethod) {
        if (!cart || !cart.length) {
            alert('Your cart is empty.');
            return;
        }
        const orderId = 'DD-' + Date.now();
        const order = {
            id: orderId,
            items: cart,
            total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
            customer: customer || {},
            paymentMethod: paymentMethod || 'cash_on_delivery',
            status: 'pending',
            createdAt: new Date().toISOString()
        };
        const orders = JSON.parse(localStorage.getItem('datum_dahleez_orders') || '[]');
        orders.push(order);
        localStorage.setItem('datum_dahleez_orders', JSON.stringify(orders));
        return order;
    }

    getOrderHistory() {
        return JSON.parse(localStorage.getItem('datum_dahleez_orders') || '[]');
    }

    getOrderById(orderId) {
        return this.getOrderHistory().find(o => o.id === orderId);
    }
}

window.paymentProcessor = new PaymentProcessor();
