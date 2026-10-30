import { getCart, setLocalStorage, CART_KEY } from "./utils.mjs";

const listElement = document.querySelector("#cart-list");
const totalElement = document.querySelector("#cart-total");

function cartItemTemplate(item, index) {
  const color = item.Colors?.[0]?.ColorName ?? "";
  const link = `/product_pages/index.html?product=${item.Id}`;

  return `<li class="cart-card divider">
    <a href="${link}" class="cart-card__image">
      <img src="${item.Image}" alt="${item.Name}" />
    </a>
    <h2 class="cart-card__name"><a href="${link}">${item.Name}</a></h2>
    <p class="cart-card__color">${color}</p>
    <p class="cart-card__quantity">qty: 1</p>
    <p class="cart-card__price">$${Number(item.FinalPrice).toFixed(2)}</p>
    <button class="cart-card__remove" data-index="${index}"
            aria-label="Remove ${item.Name} from cart">&#10005;</button>
  </li>`;
}

function renderCartContents() {
  const cart = getCart();

  if (cart.length === 0) {
    listElement.innerHTML = `<li class="cart-empty">Your cart is empty. <a href="/index.html">Keep shopping</a></li>`;
    totalElement.hidden = true;
    return;
  }

  listElement.innerHTML = cart.map(cartItemTemplate).join("");

  const total = cart.reduce((sum, item) => sum + Number(item.FinalPrice), 0);
  totalElement.textContent = `Total: $${total.toFixed(2)}`;
  totalElement.hidden = false;
}

// One listener on the list handles every remove button, including re-rendered ones
listElement.addEventListener("click", (event) => {
  const button = event.target.closest(".cart-card__remove");
  if (!button) return;

  const cart = getCart();
  cart.splice(Number(button.dataset.index), 1);
  setLocalStorage(CART_KEY, cart);
  renderCartContents();
});

renderCartContents();