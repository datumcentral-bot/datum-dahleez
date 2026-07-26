/**
 * Datum Dahleez Store - Main Application
 * Initializes all modules and handles global functionality
 */

// Initialize all modules when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Core functionality
    console.log('Datum Dahleez Store - Professional E-Commerce Platform');
    console.log('Global Presence: https://datumcentral-bot.github.io/datum-dahleez');

    // Initialize modules
    if (typeof shoppingCart !== 'undefined') {
        console.log('✓ Shopping Cart initialized');
    }

    if (typeof customerAccounts !== 'undefined') {
        console.log('✓ Customer Accounts initialized');
    }

    if (typeof productDatabase !== 'undefined') {
        console.log('✓ Product Database initialized');
    }

    if (typeof paymentProcessor !== 'undefined') {
        console.log('✓ Payment Processor initialized');
    }

    if (typeof emailNotifier !== 'undefined') {
        console.log('✓ Email Notifications initialized');
    }

    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }

        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }

        .modal {
            display: none;
            position: fixed;
            z-index: 1000;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0,0,0,0.5);
            animation: fadeIn 0.3s ease;
        }

        .modal-content {
            background-color: white;
            margin: 5% auto;
            padding: 30px;
            border-radius: 12px;
            width: 90%;
            max-width: 600px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        }

        .close-btn {
            color: #aaa;
            float: right;
            font-size: 28px;
            font-weight: bold;
            cursor: pointer;
        }

        .close-btn:hover {
            color: black;
        }

        .checkout-options {
            display: grid;
            gap: 20px;
            margin-top: 20px;
        }

        .checkout-option {
            border: 1px solid #e1e1e1;
            border-radius: 8px;
            padding: 20px;
            text-align: center;
        }

        .checkout-option button {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 25px;
            cursor: pointer;
            margin-top: 10px;
            font-weight: 600;
        }

        .featured-badge {
            position: absolute;
            top: 10px;
            right: 10px;
            background: #667eea;
            color: white;
            padding: 5px 10px;
            border-radius: 15px;
            font-size: 0.8em;
            font-weight: 600;
        }

        .out-of-stock {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0,0,0,0.8);
            color: white;
            padding: 10px 20px;
            border-radius: 8px;
            font-weight: 600;
        }

        .product-card {
            transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .product-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }

        .cart-notification {
            animation: slideIn 0.3s ease;
        }

        .no-results {
            text-align: center;
            padding: 40px;
            color: #666;
            font-size: 1.1em;
        }
    `;
    document.head.appendChild(style);
});

// Global functions for inline HTML events
function showCheckout() {
    if (typeof paymentProcessor !== 'undefined') {
        paymentProcessor.initiateCheckout();
    }
}

function showLogin() {
    document.getElementById('login-modal').style.display = 'block';
}

function showRegister() {
    document.getElementById('register-modal').style.display = 'block';
}

function closeModals() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.style.display = 'none';
    });
}

// Close modal when clicking outside
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
    }
}

// Performance optimization: Lazy load images
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}
