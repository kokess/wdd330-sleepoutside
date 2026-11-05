
import { addToCart, updateCartCount } from "./utils.mjs";

export default class ProductDetails {
    constructor(productId, dataSource) {
        this.productId = productId;
        this.product = {};
        this.dataSource = dataSource;
    }

    async init() {
        updateCartCount();

        if (!this.productId) {
            this.showMessage(
                "No product selected. Go back to the home page and choose a tent."
            );
            return;
        }

        try {
            this.product = await this.dataSource.findProductById(
                this.productId
            );

            if (!this.product) {
                this.showMessage(
                    `Sorry, we couldn't find a product with ID "${this.productId}".`
                );
                return;
            }

            this.renderProductDetails();
            this.setupQuantityControls();

            document
                .getElementById("addToCart")
                .addEventListener(
                    "click",
                    this.addProductToCart.bind(this)
                );

        } catch (error) {
            console.error("Could not load product:", error);

            this.showMessage(
                "Something went wrong loading this product. Please try again."
            );
        }
    }

    showMessage(message) {
        const p = document.createElement("p");
        p.className = "product-message";
        p.textContent = message;
        document.querySelector("main").replaceChildren(p);
    }

    renderProductDetails() {
        const product = this.product;
        const color = product.Colors?.[0]?.ColorName ?? "";

        const html = `
      <section class="product-detail">

        <h3>${product.Brand?.Name ?? ""}</h3>

        <h2 class="divider">
          ${product.NameWithoutBrand}
        </h2>

        <img
          class="divider"
          src="${product.Image}"
          alt="${product.NameWithoutBrand}"
        />

        <p class="product-card__price">
          $${product.FinalPrice}
        </p>

        <p class="product__color">
          ${color}
        </p>

        <p class="product__description__html">
          ${product.DescriptionHtmlSimple}
        </p>

        <div class="product-detail__add">

          <div class="quantity-picker">

            <button
              type="button"
              id="qty-minus"
              aria-label="Decrease quantity"
            >&minus;</button>

            <input
              id="quantity"
              type="number"
              min="1"
              max="99"
              value="1"
              aria-label="Quantity"
            />

            <button
              type="button"
              id="qty-plus"
              aria-label="Increase quantity"
            >+</button>

          </div>

          <button id="addToCart" data-id="${product.Id}">
            Add to Cart
          </button>

          <p id="add-status" role="status" aria-live="polite"></p>

          <a id="view-cart" href="/cart/index.html" hidden>
            View cart
          </a>

        </div>
      </section>
    `;

        document.querySelector("main").innerHTML = html;
    }

    setupQuantityControls() {
        const qtyInput = document.getElementById("quantity");

        const readQty = () =>
            Math.min(99, Math.max(1, parseInt(qtyInput.value, 10) || 1));

        document.getElementById("qty-minus").addEventListener("click", () => {
            qtyInput.value = Math.max(1, readQty() - 1);
        });

        document.getElementById("qty-plus").addEventListener("click", () => {
            qtyInput.value = Math.min(99, readQty() + 1);
        });
    }

    addProductToCart() {
        const qtyInput = document.getElementById("quantity");
        const status = document.getElementById("add-status");
        const viewCart = document.getElementById("view-cart");

        const quantity = Math.min(
            99,
            Math.max(1, parseInt(qtyInput.value, 10) || 1)
        );

        addToCart(this.product, quantity);

        qtyInput.value = quantity;

        status.textContent =
            `${quantity} × ${this.product.NameWithoutBrand} added to your cart.`;

        viewCart.hidden = false;
    }
}
