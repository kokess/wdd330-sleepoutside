// One key used everywhere, so product.js and cart.js can never disagree
export const CART_KEY = "so-cart";

// Read from local storage. Returns null if the key is missing or the data is corrupt.
export function getLocalStorage(key) {
  try {
    return JSON.parse(localStorage.getItem(key));
  } catch {
    return null;
  }
}

// Write to local storage
export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

// Read a parameter from the page URL, e.g. ?product=880RR -> "880RR"
export function getParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

// Always returns an array of items that each have a Quantity of at least 1
export function getCart() {
  const stored = getLocalStorage(CART_KEY);
  const items = Array.isArray(stored) ? stored : stored ? [stored] : [];
  return items.map((item) => ({
    ...item,
    Quantity: Math.max(1, Number(item.Quantity) || 1),
  }));
}

export function saveCart(cart) {
  setLocalStorage(CART_KEY, cart);
  updateCartCount();
}

// Add a product; if it is already in the cart, increase its quantity
export function addToCart(product, quantity = 1) {
  const cart = getCart();
  const existing = cart.find((item) => item.Id === product.Id);

  if (existing) {
    existing.Quantity += quantity;
  } else {
    cart.push({ ...product, Quantity: quantity });
  }
  saveCart(cart);
}

// delta is +1 or -1; an item that reaches 0 is removed
export function changeQuantity(id, delta) {
  const cart = getCart();
  const item = cart.find((i) => i.Id === id);
  if (!item) return;

  item.Quantity += delta;
  saveCart(cart.filter((i) => i.Quantity > 0));
}

export function removeFromCart(id) {
  saveCart(getCart().filter((item) => item.Id !== id));
}

export function clearCart() {
  saveCart([]);
}

export function getCartCount() {
  return getCart().reduce((count, item) => count + item.Quantity, 0);
}

export function updateCartCount() {
  const el = document.querySelector("#cart-count");
  if (!el) return;
  const count = getCartCount();
  el.textContent = count;
  el.hidden = count === 0;
}