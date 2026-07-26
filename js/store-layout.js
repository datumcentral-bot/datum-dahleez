/**
 * Datum Dahleez Store - Shared Layout Controller
 * Cart count, shared nav, checkout links
 */

(function() {
    'use strict';

    function updateCartCount() {
        const cart = JSON.parse(localStorage.getItem('datum_dahleez_cart') || '[]');
        const count = cart.reduce((sum, item) => sum + item.quantity, 0);
        document.querySelectorAll('.cart-count').forEach(el => {
            el.textContent = count;
        });
    }

    function initStoreLinks() {
        document.querySelectorAll('a[href="cart.html"]').forEach(link => {
            link.addEventListener('click', () => {
                setTimeout(updateCartCount, 100);
            });
        });
    }

    document.addEventListener('DOMContentLoaded', () => {
        updateCartCount();
        initStoreLinks();
    });

    window.StoreLayout = { updateCartCount };
})();
