const Product = require("./product.model");

class ProductDiscount {
    constructor(productDiscount) {
        this.id = productDiscount.id;
        this.percentage = productDiscount.percentage;
        this.product = new Product(productDiscount.product);
    }
}

module.exports = ProductDiscount;