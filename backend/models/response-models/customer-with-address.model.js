const Address = require("./address.model");

class CustomerWithAddresses {
    constructor(customer) {
        this.id = customer.id;
        this.name = customer.name;
        this.pib = customer.pib;
        this.rank = customer.rank;

        this.addresses = customer.addresses.map(a => new Address(a));
    }
}

module.exports = CustomerWithAddresses;