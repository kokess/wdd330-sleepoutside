import { getLocalStorage, setLocalStorage, getParam } from "./utils.mjs";
import ProductData from "./ProductData.mjs";

const dataSource = new ProductData("tents");
const productId = getParam("product");

async function addProductToCart(productId) {
  console.log("Add to cart clicked for product ID:", productId);

  const product = await dataSource.findProductById(productId);
  console.log("Fetched product details:", product);

  let cart = getLocalStorage("so-cart");

  if (!Array.isArray(cart)) {
    cart = cart ? [cart] : [];
  }

  cart.push(product);
  setLocalStorage("so-cart", cart);
  console.log("Cart saved to localStorage:", cart);
}

const addToCartButton = document.getElementById("addToCart");
if (addToCartButton) {
  addToCartButton.addEventListener("click", () => {
    addProductToCart(productId);
  });
} else {
  console.log("Error: #addToCart button not found on this page!");
}