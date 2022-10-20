const Customer = require("./customer.model");
const Address = require("./address.model");

class Order {
    constructor(order) {
        this.id = order.id;
        this.baseAmount = parseFloat(order.baseAmount);
        this.pdvAmount = parseFloat(order.pdvAmount);
        this.totalAmountWithPdv = parseFloat(order.totalAmountWithPdv);
        this.shippingAmount = parseFloat(order.shippingAmount);
        this.shippingAmountWithPdv = parseFloat(order.shippingAmountWithPdv);
        this.totalPrice = parseFloat(order.totalPrice);
        this.status = order.status;
        this.isPaid = order.isPaid;
        this.createdAt = order.createdAt.toLocaleString();
        this.updatedAt = order.updatedAt.toLocaleString();

        this.customer = new Customer(order.customer);
        this.customerAddress = new Address(order.customerAddress);
    }
}

module.exports = Order;