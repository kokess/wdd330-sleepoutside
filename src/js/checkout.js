import { loadHeaderFooter } from '../js/utils.mjs';
import CheckoutProcess from '../js/CheckoutProcess.mjs';

// Load the site-wide header and footer partials
loadHeaderFooter();

// Create an instance of CheckoutProcess pointing to your cart localStorage key and summary selector
const myCheckout = new CheckoutProcess('so-cart', '.order-summary');
myCheckout.init();

// 1. Listen for the 'blur' event on the zip code input field
document.querySelector('#zip').addEventListener('blur', () => {
    myCheckout.calculateOrderTotal();
});

// 2. Listen for form submission to process the checkout and send data to the backend
document.forms['checkout'].addEventListener('submit', (e) => {
    e.preventDefault();

    // Call the checkout method passing the form element
    myCheckout.checkout(document.forms['checkout'])
        .then((res) => {
            console.log('Success!', res);

            // 1. Save the server response data to localStorage for the success page
            localStorage.setItem('orderSummary', JSON.stringify(res));

            // 2. Clear the cart from localStorage
            localStorage.removeItem('so-cart');

            // 3. Redirect to the success confirmation page
            window.location.href = './success.html';
        })
        .catch((err) => {
            console.error('Checkout error:', err);
        });
});