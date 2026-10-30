/* src/js/main.js */

// 1. Import the default function from productList.mjs
// This function knows how to fetch data and render the cards.
import productList from "./productList.mjs";

// 2. Configure the homepage product list.
// - 'tents' is the category to search for in your json files.
// - '.product-list' is the CSS selector for where to insert the cards.
productList("tents", ".product-list");

console.log("main.js loaded and productList activated.");