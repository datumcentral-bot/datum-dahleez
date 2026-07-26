/**
 * Datum Dahleez Store - Shopping Cart System
 * Professional e-commerce shopping cart with localStorage persistence
 */

class ShoppingCart {
    constructor() {
        this.cart = this.loadCart();
        this.init();
    }

    init() {
        // Load cart on page load
        this.updateCartDisplay();
        this.attachEventListeners();
    }

    loadCart() {
        const saved = localStorage.getItem('datum_dahleez_cart');
        return saved ? JSON.parse(saved) : [];
    }

    saveCart() {
        localStorage.setItem('datum_dahleez_cart', JSON.stringify(this.cart));
        this.updateCartDisplay();
    }

    addItem(product) {
        const existingItem = this.cart.find(item => item.id === product.id);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.cart.push({ ...product, quantity: 1 });
        }
        this.saveCart();
        this.showNotification(`${product.name} added to cart!`);
        if (typeof renderCart === 'function') {
            renderCart();
        }
    }

    removeItem(productId) {
        this.cart = this.cart.filter(item => item.id !== productId);
        this.saveCart();
        if (typeof renderCart === 'function') {
            renderCart();
        }
    }

    updateQuantity(productId, quantity) {
        const item = this.cart.find(item => item.id === productId);
        if (item) {
            item.quantity = Math.max(1, quantity);
            this.saveCart();
        }
    }

    getTotal() {
        return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    getItemCount() {
        return this.cart.reduce((count, item) => count + item.quantity, 0);
    }

    clearCart() {
        this.cart = [];
        this.saveCart();
    }

    updateCartDisplay() {
        const cartCount = document.getElementById('cart-count');
        if (cartCount) {
            cartCount.textContent = this.getItemCount();
        }
    }

    attachEventListeners() {
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('add-to-cart-btn')) {
                e.preventDefault();
                const productData = {
                    id: e.target.dataset.productId,
                    name: e.target.dataset.productName,
                    price: parseFloat(e.target.dataset.productPrice),
                    image: e.target.dataset.productImage,
                    category: e.target.dataset.productCategory
                };
                this.addItem(productData);
            }
        });
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'cart-notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #0071e3;
            color: white;
            padding: 15px 25px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            animation: slideIn 0.3s ease;
        `;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
    }
}

function addToCart(name, price, image, category, id) {
    const product = {
        id: id || 'prod-' + Date.now() + '-' + Math.random().toString(36).slice(2, 7),
        name: name || 'Product',
        price: typeof price === 'string' ? parseFloat(price.replace(/[^0-9.]/g, '')) || 0 : (price || 0),
        image: image || '',
        category: category || 'general',
        inStock: true,
        unit: 'piece'
    };
    if (window.shoppingCart) {
        window.shoppingCart.addItem(product);
    } else {
        console.warn('ShoppingCart not initialized');
    }
}

window.addToCart = addToCart;

// Initialize shopping cart
window.shoppingCart = new ShoppingCart();
