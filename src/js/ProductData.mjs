import { getLocalStorage, setLocalStorage } from "./utils.mjs";

function addProductToCart(product) {
  // 1. Get existing cart contents from local storage
  let cart = getLocalStorage("so-cart");

  // 2. Ensure it's an array (if it's null or a single object, convert to array)
  if (!Array.isArray(cart)) {
    cart = cart ? [cart] : [];
  }

  // 3. Add the new product to the array
  cart.push(product);

  // 4. Save the updated array back to local storage
  setLocalStorage("so-cart", cart);
}