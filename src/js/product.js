import { getCart, setLocalStorage, getParam, CART_KEY } from "./utils.mjs";
import ProductData from "./ProductData.mjs";

const dataSource = new ProductData("tents");
const productId = getParam("product");

// textContent (not innerHTML) because productId comes from the URL
function showMessage(text) {
  const p = document.createElement("p");
  p.className = "product-message";
  p.textContent = text;
  document.querySelector("main").replaceChildren(p);
}

async function loadProductDetails() {
  if (!productId) {
    showMessage("No product selected. Go back to the home page and choose a tent.");
    return;
  }

  try {
    const product = await dataSource.findProductById(productId);

    if (!product) {
      showMessage(`Sorry, we couldn't find a product with ID "${productId}".`);
      return;
    }

    renderProductDetails(product);

    document
      .getElementById("addToCart")
      .addEventListener("click", () => addProductToCart(product));
  } catch (error) {
    console.error("Could not load product:", error);
    showMessage("Something went wrong loading this product. Please try again.");
  }
}

function renderProductDetails(product) {
  const color = product.Colors?.[0]?.ColorName ?? "";

  const html = `<section class="product-detail">
    <h3>${product.Brand.Name}</h3>
    <h2 class="divider">${product.NameWithoutBrand}</h2>
    <img class="divider" src="${product.Image}" alt="${product.NameWithoutBrand}" />
    <p class="product-card__price">$${product.FinalPrice}</p>
    <p class="product__color">${color}</p>
    <p class="product__description__html">${product.DescriptionHtmlSimple}</p>
    <div class="product-detail__add">
      <button id="addToCart" data-id="${product.Id}">Add to Cart</button>
    </div>
  </section>`;

  document.querySelector("main").innerHTML = html;
}

function addProductToCart(product) {
  const cart = getCart();
  cart.push(product);
  setLocalStorage(CART_KEY, cart);
  alert(`${product.NameWithoutBrand} was added to your cart.`);
}

loadProductDetails();