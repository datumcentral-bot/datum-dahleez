const CART_KEY = 'datum_dahleez_cart';

function getCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function addToCart(name, price) {
  const cart = getCart();
  const existing = cart.find(item => item.name === name);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ name, price, qty: 1 });
  }
  saveCart(cart);
  updateCartCount();
  alert(name + ' added to cart!');
}

function removeFromCart(name) {
  let cart = getCart();
  cart = cart.filter(item => item.name !== name);
  saveCart(cart);
  updateCartCount();
  renderCart();
}

function changeQty(name, delta) {
  const cart = getCart();
  const item = cart.find(i => i.name === name);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) {
    cart = cart.filter(i => i.name !== name);
  }
  saveCart(cart);
  updateCartCount();
  renderCart();
}

function getCartTotal() {
  return getCart().reduce((sum, item) => sum + (parseInt(item.price.replace(/,/g, '')) * item.qty), 0);
}

function getCartCount() {
  return getCart().reduce((count, item) => count + item.qty, 0);
}

function updateCartCount() {
  const count = getCartCount();
  document.querySelectorAll('.cart-count').forEach(el => {
    el.textContent = count;
    el.style.display = count > 0 ? 'inline-block' : 'none';
  });
}

function renderCart() {
  const cart = getCart();
  const tbody = document.getElementById('cart-items');
  const emptyMsg = document.getElementById('cart-empty');
  const summary = document.getElementById('cart-summary');
  const checkoutBtn = document.getElementById('checkout-btn');

  if (!tbody) return;

  if (cart.length === 0) {
    tbody.innerHTML = '';
    if (emptyMsg) emptyMsg.style.display = 'block';
    if (summary) summary.style.display = 'none';
    if (checkoutBtn) checkoutBtn.style.display = 'none';
    return;
  }

  if (emptyMsg) emptyMsg.style.display = 'none';
  if (summary) summary.style.display = 'block';
  if (checkoutBtn) checkoutBtn.style.display = 'inline-block';

  tbody.innerHTML = cart.map(item => `
    <tr>
      <td>${item.name}</td>
      <td>Rs. ${item.price}</td>
      <td>
        <button type="button" onclick="changeQty('${item.name.replace(/'/g, "\\'")}', -1)">-</button>
        <span>${item.qty}</span>
        <button type="button" onclick="changeQty('${item.name.replace(/'/g, "\\'")}', 1)">+</button>
      </td>
      <td>Rs. ${(parseInt(item.price.replace(/,/g, '')) * item.qty).toLocaleString()}</td>
      <td><button type="button" onclick="removeFromCart('${item.name.replace(/'/g, "\\'")}')">Remove</button></td>
    </tr>
  `).join('');

  const totalEl = document.getElementById('cart-total');
  if (totalEl) totalEl.textContent = 'Rs. ' + getCartTotal().toLocaleString();
}

function clearCart() {
  localStorage.removeItem(CART_KEY);
  updateCartCount();
}
