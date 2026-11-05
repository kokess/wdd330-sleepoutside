
import { getParam } from "./utils.mjs";
import ProductData from "./ProductData.mjs";
import ProductDetails from "./ProductDetails.mjs";

// Get the product ID from the URL
const productId = getParam("product");

// Create the product data source
const dataSource = new ProductData("tents");

// Create a ProductDetails instance
const product = new ProductDetails(productId, dataSource);

// Initialize the product details page
product.init();
