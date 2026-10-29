import { getLocalStorage, setLocalStorage, getParam } from "./utils.mjs";
import ProductData from "./ProductData.mjs";

const dataSource = new ProductData("tents");
const productId = getParam("product");

console.log("Current Product ID from URL:", productId);

async function loadProductDetails() {
  if (!productId) {
    console.error("Error: No product ID found in the URL! (Example: ?product=880RR)");
    return;
  }

  const product = await dataSource.findProductById(productId);
  if (product) {
    renderProductDetails(product);

    const addToCartButton = document.getElementById("addToCart");
    if (addToCartButton) {
      addToCartButton.addEventListener("click", () => {
        console.log("Add to Cart button clicked for:", product.Name);
        addProductToCart(product);
      });
    } else {
      console.log("Error: #addToCart button not found in DOM.");
    }
  } else {
    console.error("Error: Product not found for ID:", productId);
  }
}

function renderProductDetails(product) {
  const html = `<section class="product-detail"> 
    <h3>${product.Brand.Name}</h3>
    <h2 class="divider">${product.NameWithoutBrand}</h2>
    <img class="divider" src="${product.Image}" alt="${product.NameWithoutBrand}" />
    <p class="product-card__price">$${product.FinalPrice}</p>
    <p class="product__color">${product.Colors[0].ColorName}</p>
    <p class="product__description__html">${product.DescriptionHtmlSimple}</p>
    <div class="product-detail__add">
      <button id="addToCart" data-id="${product.Id}">Add to Cart</button>
    </div>
  </section>`;

  document.querySelector("main").innerHTML = html;
}

function addProductToCart(product) {
  let cart = getLocalStorage("so-cart");
  if (!Array.isArray(cart)) {
    cart = cart ? [cart] : [];
  }
  cart.push(product);
  setLocalStorage("so-cart", cart);
  alert("Success! Item added to your cart.");
}

loadProductDetails();