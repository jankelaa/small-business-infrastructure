class Product {
    constructor(product) {
        this.id = product.id;
        this.barcode = product.barcode;
        this.categoryId = product.categoryId;
        this.name = product.name;
        this.imgUrl = product.imgUrl;
        this.size = product.size;
        this.bundleSize = product.bundleSize;
    }
}

module.exports = Product;