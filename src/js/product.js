import { addToCart, getParam, updateCartCount } from "./utils.mjs";
import ProductData from "./ProductData.mjs";

const dataSource = new ProductData("tents");
const productId = getParam("product");

function showMessage(text) {
  const p = document.createElement("p");
  p.className = "product-message";
  p.textContent = text;
  document.querySelector("main").replaceChildren(p);
}

async function loadProductDetails() {
  updateCartCount();

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
    setupAddToCart(product);
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
      <div class="quantity-picker">
        <button type="button" id="qty-minus" aria-label="Decrease quantity">&minus;</button>
        <input id="quantity" type="number" min="1" max="99" value="1" aria-label="Quantity" />
        <button type="button" id="qty-plus" aria-label="Increase quantity">+</button>
      </div>
      <button id="addToCart" data-id="${product.Id}">Add to Cart</button>
      <p id="add-status" role="status" aria-live="polite"></p>
      <a id="view-cart" href="/cart/index.html" hidden>View cart</a>
    </div>
  </section>`;

  document.querySelector("main").innerHTML = html;
}

function setupAddToCart(product) {
  const qtyInput = document.getElementById("quantity");
  const status = document.getElementById("add-status");
  const viewCart = document.getElementById("view-cart");

  const readQty = () =>
    Math.min(99, Math.max(1, parseInt(qtyInput.value, 10) || 1));

  document.getElementById("qty-minus").addEventListener("click", () => {
    qtyInput.value = Math.max(1, readQty() - 1);
  });

  document.getElementById("qty-plus").addEventListener("click", () => {
    qtyInput.value = Math.min(99, readQty() + 1);
  });

  document.getElementById("addToCart").addEventListener("click", () => {
    const quantity = readQty();
    addToCart(product, quantity);
    qtyInput.value = quantity;
    status.textContent = `${quantity} × ${product.NameWithoutBrand} added to your cart.`;
    viewCart.hidden = false;
  });
}

loadProductDetails();