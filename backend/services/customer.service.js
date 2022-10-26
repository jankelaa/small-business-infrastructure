const { isNil } = require('lodash');
const { Customer, CustomerAddress, CustomerPermanentDiscount, CustomerProductDiscount, Product } = require('../models');
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
    async customerSignup(name, pib, email, phone,
        address, country, city, postcode, rank, transaction = null) {

        return await Customer.create({
            name,
            pib,
            email,
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

    async addPermanentDiscountForCustomer(customerId, percentage, transaction = null) {
        return await CustomerPermanentDiscount.create({
            customerId,
            percentage
        }, {
            upsertKeys: ['customerId'],
            updateOnDuplicate: ['percentage'],
            transaction
        }
        );
    }

    async addProductDiscountForCustomer(customerId, productId, percentage, transaction = null) {
        return await CustomerProductDiscount.create({
            customerId,
            productId,
            percentage
        }, {
            upsertKeys: ['customerId', 'productId'],
            updateOnDuplicate: ['percentage'],
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

    async getCustomerWithAllById(customerId, transaction = null) {
        const res = await Customer.findOne({
            include: [
                Customer.Addresses,
                Customer.PermanentDiscount,
                {
                    association: Customer.ProductDiscounts,
                    include: {
                        model: Product,
                        as: 'product'
                    }
                }
            ],
            where: { id: customerId },
            transaction
        });

        return isNil(res) ? null : res;
    }

    async getCustomerForOrderByPib(pib, transaction = null) {
        const res = await Customer.findOne({
            include: [
                Customer.Addresses,
                Customer.PermanentDiscount,
                Customer.ProductDiscounts
            ],
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

    async upgradeCustomerRank(customerId, rank, transaction = null) {
        await Customer.update({
            rank
        }, {
            where: { id: customerId },
            transaction
        })
    }
}

module.exports = (() => {
    if (isNil(instance)) {
        instance = new CustomerService();
    }

    return instance;
})();