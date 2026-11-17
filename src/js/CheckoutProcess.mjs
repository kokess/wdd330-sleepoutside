import { getLocalStorage } from './utils.mjs';
import ExternalServices from './ExternalServices.mjs';

const services = new ExternalServices();

function packageItems(items) {
    // Convert the list of products from localStorage to the simpler form required for the backend
    return items.map((item) => ({
        id: item.Id,
        name: item.Name,
        price: item.FinalPrice,
        quantity: 1
    }));
}

export default class CheckoutProcess {
    constructor(key, outputSelector) {
        this.key = key;
        this.outputSelector = outputSelector;
        this.list = [];
        this.itemTotal = 0;
        this.shipping = 0;
        this.tax = 0;
        this.orderTotal = 0;
    }

    init() {
        this.list = getLocalStorage(this.key);
        this.calculateItemSummary();
    }

    calculateItemSummary() {
        // Calculate and display the total dollar amount of the items in the cart, and the number of items.
        const summaryElement = document.querySelector(`${this.outputSelector} #cartTotal`);
        const itemNumElement = document.querySelector(`${this.outputSelector} #num-items`);

        // Sum up item prices
        const amounts = this.list.map((item) => item.FinalPrice);
        this.itemTotal = amounts.reduce((sum, item) => sum + item, 0);

        if (summaryElement) {
            summaryElement.innerText = `$${this.itemTotal.toFixed(2)}`;
        }
        if (itemNumElement) {
            itemNumElement.innerText = this.list.length;
        }
    }

    calculateOrderTotal() {
        // Calculate tax (6%) and shipping ($10 for first item, $2 for each additional)
        this.tax = this.itemTotal * 0.06;
        this.shipping = this.list.length > 0 ? 10 + (this.list.length - 1) * 2 : 0;

        // Calculate overall order total
        this.orderTotal = (
            parseFloat(this.itemTotal) +
            parseFloat(this.tax) +
            parseFloat(this.shipping)
        ).toFixed(2);

        this.displayOrderTotals();
    }

    displayOrderTotals() {
        // Display the calculated totals in the order summary area
        const subtotal = document.querySelector(`${this.outputSelector} #subtotal`);
        const tax = document.querySelector(`${this.outputSelector} #tax`);
        const shipping = document.querySelector(`${this.outputSelector} #shipping`);
        const orderTotal = document.querySelector(`${this.outputSelector} #orderTotal`);

        if (subtotal) subtotal.innerText = `$${this.itemTotal.toFixed(2)}`;
        if (tax) tax.innerText = `$${this.tax.toFixed(2)}`;
        if (shipping) shipping.innerText = `$${this.shipping.toFixed(2)}`;
        if (orderTotal) orderTotal.innerText = `$${this.orderTotal}`;
    }

    async checkout(form) {
        // Get the form element data, convert to JSON, and append required backend fields
        const formData = formDataToJSON(form);

        formData.orderDate = new Date().toISOString();
        formData.orderTotal = this.orderTotal;
        formData.tax = this.tax.toFixed(2);
        formData.shipping = this.shipping;
        formData.items = packageItems(this.list);

        try {
            const res = await services.checkout(formData);
            console.log('Order submitted successfully:', res);
            // Next steps: clear local storage, redirect to a success page, etc.
            return res;
        } catch (err) {
            console.error('Checkout submission failed:', err);
            throw err;
        }
    }
}