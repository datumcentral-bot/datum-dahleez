/**
 * Datum Dahleez Store - Payment Processing
 * Professional payment system with manual and Stripe options
 */

class PaymentProcessor {
    constructor() {
        this.init();
    }

    init() {
        this.attachEventListeners();
    }

    attachEventListeners() {
        // Checkout button
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

        // Show checkout options
        const checkoutOptions = `
            <div id="checkout-modal" class="modal">
                <div class="modal-content">
                    <span class="close-btn">&times;</span>
                    <h2>Checkout</h2>
                    <div class="checkout-options">
                        <div class="checkout-option">
                            <h3>Option 1: Manual Payment</h3>
                            <p>Bank transfer or cash on delivery</p>
                            <button onclick="paymentProcessor.processManualPayment()">Continue with Manual Payment</button>
                        </div>
                        <div class="checkout-option">
                            <h3>Option 2: Card Payment</h3>
                            <p>Pay with credit/debit card</p>
                            <button onclick="paymentProcessor.processCardPayment()">Pay Now</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', checkoutOptions);
        this.showModal();
    }

    processManualPayment() {
        const cart = JSON.parse(localStorage.getItem('datum_dahleez_cart') || '[]');
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        // Generate order ID
        const orderId = 'DD-' + Date.now();
        const order = {
            id: orderId,
            items: cart,
            total: total,
            status: 'pending',
            paymentMethod: 'manual',
            createdAt: new Date().toISOString()
        };

        // Save order
        const orders = JSON.parse(localStorage.getItem('datum_dahleez_orders') || '[]');
        orders.push(order);
        localStorage.setItem('datum_dahleez_orders', JSON.stringify(orders));

        // Clear cart
        localStorage.removeItem('datum_dahleez_cart');

        alert(`Order placed successfully!\n\nOrder ID: ${orderId}\nTotal: $${total.toFixed(2)}\n\nPlease complete payment via bank transfer within 24 hours.`);
        this.hideModal();
        window.location.reload();
    }

    processCardPayment() {
        // In production, integrate Stripe or similar payment processor
        alert('Card payment integration requires Stripe setup.\n\nFor now, please use manual payment option.\n\nContact us for card payment setup.');
        this.hideModal();
    }

    showModal() {
        const modal = document.getElementById('checkout-modal');
        if (modal) {
            modal.style.display = 'block';
            const closeBtn = modal.querySelector('.close-btn');
            if (closeBtn) {
                closeBtn.onclick = () => this.hideModal();
            }
        }
    }

    hideModal() {
        const modal = document.getElementById('checkout-modal');
        if (modal) {
            modal.remove();
        }
    }

    getOrderHistory() {
        const orders = JSON.parse(localStorage.getItem('datum_dahleez_orders') || '[]');
        return orders;
    }

    getOrderById(orderId) {
        const orders = this.getOrderHistory();
        return orders.find(o => o.id === orderId);
    }
}

// Initialize payment processor
const paymentProcessor = new PaymentProcessor();
