class Customer {
    constructor(customer) {
        this.id = customer.id;
        this.name = customer.name;
        this.pib = customer.pib;
        this.email = customer.email;
        this.rank = customer.rank;
        // this.phone = customer.phone;
    }
}

module.exports = Customer;