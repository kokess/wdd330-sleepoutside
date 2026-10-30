function convertToJson(res) {
  if (res.ok) {
    return res.json();
  }
  throw new Error(`Bad response: ${res.status} ${res.statusText}`);
}

export default class ProductData {
  constructor(category) {
    this.category = category;
    // Root-absolute path so it works from any page (home, product, cart).
    // Adjust if your json folder lives somewhere else.
    this.path = `/json/${this.category}.json`;
  }

  async getData() {
    const response = await fetch(this.path);
    return convertToJson(response);
  }

  async findProductById(id) {
    const products = await this.getData();
    // Compare as upper-case strings so ?product=880rr and ?product=880RR both work
    return products.find(
      (item) => String(item.Id).toUpperCase() === String(id).toUpperCase(),
    );
  }
}
