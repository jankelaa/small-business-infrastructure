const { isNil } = require('lodash');
const { Customer } = require('../models');
const generator = require('generate-password');

let instance = null;

class CustomerService {
    async createCustomer(name, pib, email, phone,
        address, country, city, postcode, transaction = null) {
        const secretCode = generator.generate({
            length: 10,
            numbers: true,
            lowercase: true,
            uppercase: true,
            strict: true
        });

        return await Customer.create({
            name,
            pib,
            email,
            secretCode,
            rank: 1,
            addresses: [{
                address,
                city,
                country,
                zipCode: postcode,
                isMain: true
            }]
        }, {
            include: Customer.Addresses,
            transaction
        });
    }

    async getAllCustomers() {
        return await Customer.findAll();
    }
}

module.exports = (() => {
    if (isNil(instance)) {
        instance = new CustomerService();
    }

    return instance;
})();