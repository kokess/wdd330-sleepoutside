import { setLocalStorage, getLocalStorage, loadHeaderFooter } from "./utils.mjs";
import ProductData from "./ProductData.mjs";

loadHeaderFooter();

const dataSource = new ProductData("tents");

function addProductToCart(product) {
  // Get current cart from localStorage, or start with an empty array if none exists
  let cart = getLocalStorage("so-cart") || [];

  // Ensure it's an array before pushing
  if (!Array.isArray(cart)) {
    cart = [cart];
  }

  // Push the new product into the array
  cart.push(product);

  // Save the updated array back to localStorage
  setLocalStorage("so-cart", cart);
}

// add to cart button event handler
async function addToCartHandler(e) {
  const product = await dataSource.findProductById(e.target.dataset.id);
  addProductToCart(product);
}

// add listener to Add to Cart button
document
  .getElementById("addToCart")
  .addEventListener("click", addToCartHandler);