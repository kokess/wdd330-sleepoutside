import { getLocalStorage, setLocalStorage, getParam } from "./utils.mjs";
import ProductData from "./productData.mjs";

const dataSource = new ProductData("tents");
const productId = getParam("product");

async function addProductToCart(productId) {
  const product = await dataSource.findProductById(productId);
  let cart = getLocalStorage("so-cart");

  if (!Array.isArray(cart)) {
    cart = cart ? [cart] : [];
  }

  cart.push(product);
  setLocalStorage("so-cart", cart);
}

// Attach event listener
const addToCartButton = document.getElementById("addToCart");
if (addToCartButton) {
  addToCartButton.addEventListener("click", () => {
    addProductToCart(productId);
  });
}