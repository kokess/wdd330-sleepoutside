import { loadHeaderFooter, getLocalStorage } from './utils.mjs';

// Load site-wide header and footer
loadHeaderFooter();

// Retrieve the order summary object from localStorage
const orderData = getLocalStorage('orderSummary');

if (orderData) {
    const orderIdElement = document.querySelector('#order-id');
    const orderTotalElement = document.querySelector('#order-total');

    // Populate fields if they exist in the backend response
    if (orderIdElement && orderData.id) {
        orderIdElement.textContent = orderData.id;
    }

    if (orderTotalElement && orderData.orderTotal) {
        orderTotalElement.textContent = `$${orderData.orderTotal}`;
    }

    // Optional: clear the summary so it doesn't persist if they revisit the page
    // localStorage.removeItem('orderSummary');
}