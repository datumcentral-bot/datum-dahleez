function checkout() {
  const cart = getCart();
  if (cart.length === 0) {
    alert('Your cart is empty.');
    return;
  }
  const name = document.getElementById('cod-name')?.value.trim();
  const phone = document.getElementById('cod-phone')?.value.trim();
  const address = document.getElementById('cod-address')?.value.trim();
  const city = document.getElementById('cod-city')?.value.trim();
  const notes = document.getElementById('cod-notes')?.value.trim();

  if (!name || !phone || !address || !city) {
    alert('Please fill in all required fields: Name, Phone, Address, City.');
    return;
  }

  const total = getCartTotal();
  const orderId = 'DD-' + Date.now().toString(36).toUpperCase();
  const order = {
    id: orderId,
    date: new Date().toISOString(),
    items: cart,
    total: total,
    customer: { name, phone, address, city, notes },
    payment: 'Cash on Delivery'
  };

  let orders = [];
  try {
    orders = JSON.parse(localStorage.getItem('datum_dahleez_orders') || '[]');
  } catch {}

  orders.push(order);
  localStorage.setItem('datum_dahleez_orders', JSON.stringify(orders));
  clearCart();

  alert('Order placed successfully!\n\nOrder ID: ' + orderId + '\nTotal: Rs. ' + total.toLocaleString() + '\n\nYou will pay cash on delivery. Our team will contact you shortly.');
  if (typeof window !== 'undefined') {
    window.location.href = 'index.html';
  }
}
