/* src/js/productList.mjs */

// 1. Import your ProductData class.
// We must link this file to the working class you provided.
import ProductData from "./ProductData.mjs";

// 2. The main export function that main.js is calling.
export default async function productList(category, selector) {
    // --- Create an instance of ProductData ---
    const dataSource = new ProductData(category);

    // --- Identify the output location (e.g., '.product-list') ---
    const listElement = document.querySelector(selector);

    // --- Fetch the items (the valid tents.json you confirmed) ---
    const products = await dataSource.getData();

    // --- Check if we found anything before continuing ---
    if (!products) {
        listElement.innerHTML = `<li>Sorry, no products found for ${category}.</li>`;
        return;
    }

    // --- Generate the HTML for the product cards ---
    // If your products appear but aren't clickable, THIS TEMPLATE (specifically the href) is usually the cause[cite: 2, 4].
    const productCards = products.map((product) => {
        return `<li class="product-card">
      <a href="/product-details/index.html?product=${product.Id}"> /* <<< Path must align with your project structure[cite: 2, 4] >>> */
        <img src="${product.Image}" alt="Image of ${product.Name}" />
        <h3 class="card__brand">${product.Brand.Name}</h3>
        <h2 class="card__name">${product.NameWithoutBrand}</h2>
        <p class="product-card__price">$${product.FinalPrice}</p>
      </a>
    </li>`;
    }).join(""); // .join("") combines the array of strings into one single block of HTML.

    // --- Insert the cards into the output location ---
    listElement.innerHTML = productCards;
}