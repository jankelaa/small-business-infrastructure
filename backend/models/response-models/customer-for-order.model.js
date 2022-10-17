const Address = require("./address.model");

class CustomerForOrder {
    constructor(customer) {
        this.id = customer.id;
        this.name = customer.name;
        this.pib = customer.pib;
        this.rank = customer.rank;

        this.addresses = customer.addresses.map(a => new Address(a));

        this.permanentDiscount = parseFloat(customer.permanentDiscount.percentage);
    }
}

module.exports = CustomerForOrder;