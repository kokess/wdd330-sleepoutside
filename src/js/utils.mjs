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

// Always returns an array, even if storage is empty or holds a single old-style object
export function getCart() {
  const cart = getLocalStorage(CART_KEY);
  if (Array.isArray(cart)) return cart;
  return cart ? [cart] : [];
}
