import {
  getCart,
  changeQuantity,
  removeFromCart,
  clearCart,
  updateCartCount,
} from "./utils.mjs";

const listElement = document.querySelector("#cart-list");
const totalElement = document.querySelector("#cart-total");
const clearButton = document.querySelector("#clear-cart");

function cartItemTemplate(item) {
  const color = item.Colors?.[0]?.ColorName ?? "";
  const link = `/product_pages/index.html?product=${item.Id}`;
  const lineTotal = Number(item.FinalPrice) * item.Quantity;

  return `<li class="cart-card divider">
    <a href="${link}" class="cart-card__image">
      <img src="${item.Image}" alt="${item.Name}" />
    </a>
    <h2 class="cart-card__name"><a href="${link}">${item.Name}</a></h2>
    <p class="cart-card__color">${color}</p>
    <div class="cart-card__quantity">
      <button type="button" class="cart-card__qty-btn" data-action="decrease"
              data-id="${item.Id}" aria-label="Decrease quantity of ${item.Name}">&minus;</button>
      <span class="cart-card__qty-value" aria-live="polite">${item.Quantity}</span>
      <button type="button" class="cart-card__qty-btn" data-action="increase"
              data-id="${item.Id}" aria-label="Increase quantity of ${item.Name}">+</button>
    </div>
    <p class="cart-card__price">$${lineTotal.toFixed(2)}</p>
    <button type="button" class="cart-card__remove" data-action="remove"
            data-id="${item.Id}" aria-label="Remove ${item.Name} from cart">&#10005;</button>
  </li>`;
}

function renderCartContents() {
  const cart = getCart();
  updateCartCount();

  if (cart.length === 0) {
    listElement.innerHTML = `<li class="cart-empty">Your cart is empty. <a href="/index.html">Keep shopping</a></li>`;
    totalElement.hidden = true;
    if (clearButton) clearButton.hidden = true;
    return;
  }

  listElement.innerHTML = cart.map(cartItemTemplate).join("");

  const total = cart.reduce(
    (sum, item) => sum + Number(item.FinalPrice) * item.Quantity,
    0
  );
  totalElement.textContent = `Total: $${total.toFixed(2)}`;
  totalElement.hidden = false;
  if (clearButton) clearButton.hidden = false;
}

listElement.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;

  const { action, id } = button.dataset;

  if (action === "increase") changeQuantity(id, 1);
  if (action === "decrease") changeQuantity(id, -1);
  if (action === "remove") removeFromCart(id);

  renderCartContents();
});

if (clearButton) {
  clearButton.addEventListener("click", () => {
    clearCart();
    renderCartContents();
  });
}

renderCartContents();