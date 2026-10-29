import { getLocalStorage, setLocalStorage, getParam } from "./utils.mjs";
import ProductData from "./ProductData.mjs";

const dataSource = new ProductData("tents");
const productId = getParam("product");

async function loadProductDetails() {
  const product = await dataSource.findProductById(productId);
  if (product) {
    renderProductDetails(product);

    // Attach event listener AFTER the button is rendered on the page
    const addToCartButton = document.getElementById("addToCart");
    if (addToCartButton) {
      addToCartButton.addEventListener("click", () => {
        addProductToCart(product);
      });
    }
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