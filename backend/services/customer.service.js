const { isNil } = require('lodash');
const { Customer, CustomerAddress } = require('../models');
const generator = require('generate-password');
const { Op } = require('sequelize');

let instance = null;

class CustomerService {
    async createCustomer(name, pib, email, phone,
        address, country, city, postcode, rank, transaction = null) {
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
            rank,
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

    async addAddressForCustomer(customerId, address, country, city, zipCode, transaction = null) {
        return await CustomerAddress.create({
            customerId,
            address,
            city,
            country,
            zipCode,
            isMain: false
        }, {
            transaction
        }
        );
    }

    async getCustomerById(id, transaction = null) {
        return await Customer.findByPk(id, { transaction });
    }

    async getAllCustomers() {
        return await Customer.findAll();
    }

    async getCustomerForOrderByPib(pib, transaction = null) {
        const res = await Customer.findOne({
            include: Customer.Addresses,
            where: { pib },
            transaction
        });

        return isNil(res) ? null : res;
    }

    async getCustomerByPibOrEmail(pib, email, transaction = null) {
        const res = await Customer.findOne({
            where: {
                [Op.or]: [
                    { pib },
                    { email }
                ]
            },
            transaction
        });

        return isNil(res) ? null : res;
    }
}

module.exports = (() => {
    if (isNil(instance)) {
        instance = new CustomerService();
    }

    return instance;
})();