const { isNil } = require("lodash");
const Address = require("./address.model");
const ProductDiscount = require("./product-discount.model");

class CustomerFull {
    constructor(customer) {
        this.id = customer.id;
        this.name = customer.name;
        this.pib = customer.pib;
        this.email = customer.email;
        this.rank = customer.rank;
        // this.phone = customer.phone;

        this.addresses = customer.addresses.map(a => new Address(a));

        this.permanentDiscount = isNil(customer.permanentDiscount) ? null : parseFloat(customer.permanentDiscount.percentage);

        this.productDiscounts = customer.productDiscounts.map(pd => new ProductDiscount(pd));
    }
}

module.exports = CustomerFull;