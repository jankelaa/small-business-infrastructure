class ProductForOrder {
    constructor(productForOrder) {
        this.id = productForOrder.product.id;
        this.barcode = productForOrder.product.barcode;
        this.categoryId = productForOrder.product.categoryId;
        this.name = productForOrder.product.name;
        this.imgUrl = productForOrder.product.imgUrl;
        this.size = productForOrder.product.size;
        this.bundleSize = productForOrder.product.bundleSize;

        this.quantity = productForOrder.quantity;
        this.price = productForOrder.price;
        this.baseSum = productForOrder.baseSum;
        this.permanentDiscount = productForOrder.permanentDiscount;
        this.productDiscount = productForOrder.productDiscount;
        this.totalWithoutPdv = productForOrder.totalWithoutPdv;
        this.pdvAmount = productForOrder.quantity;
        this.totalPrice = productForOrder.totalPrice;
    }
}

module.exports = ProductForOrder;