const { isNil } = require("lodash");

class ProductForOrder {
    constructor(productForOrder) {
        this.quantity = productForOrder.quantity;
        this.price = productForOrder.price;
        this.baseSum = productForOrder.baseSum;
        this.permanentDiscount = productForOrder.permanentDiscount;
        this.productDiscount = productForOrder.productDiscount;
        this.totalWithoutPdv = productForOrder.totalWithoutPdv;
        this.pdvAmount = productForOrder.pdvAmount;
        this.totalPrice = productForOrder.totalPrice;

        this.id = productForOrder.product.id;
        this.barcode = productForOrder.product.barcode;
        this.categoryId = productForOrder.product.categoryId;
        this.name = productForOrder.product.name;
        this.imgUrl = productForOrder.product.imgUrl;
        this.size = productForOrder.product.size;
        this.bundleSize = productForOrder.product.bundleSize;

        this.missingQuantity = 0;

        if (!isNil(productForOrder.product.ordersMissingProducts[0])) {
            this.missingQuantity = productForOrder.product.ordersMissingProducts[0].quantity;
        }
    }
}

module.exports = ProductForOrder;