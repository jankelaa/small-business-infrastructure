const { isNil } = require('lodash');
const bcrypt = require('bcrypt');
const generator = require('generate-password');
const moment = require('moment');
const { Op } = require('sequelize');

const { Customer, CustomerAddress, CustomerPermanentDiscount, CustomerProductDiscount, Product } = require('../models');
const emailService = require('./email.service');

const saltRounds = 10;

let instance = null;

class CustomerService {
    async createCustomer(name, pib, email, phone,
        address, country, city, postcode, rank, transaction = null) {
        const secretCodeHash = await generateSecretCodeHash(email, name);

        return await Customer.create({
            name,
            pib,
            email,
            secretCode: secretCodeHash,
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
        });
    }

    async getCustomerById(id, transaction = null) {
        return await Customer.findByPk(id, { transaction });
    }

    async getAllCustomers() {
        return await Customer.findAll();
    }

    async getCustomerWithAllById(customerId, transaction = null) {
        const dateNow = moment.utc();

        const res = await Customer.findOne({
            include: [
                Customer.Addresses,
                Customer.PermanentDiscount,
                {
                    association: Customer.ProductDiscounts,
                    where: {
                        dateExpire: {
                            [Op.gte]: dateNow
                        }
                    },
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
        const dateNow = moment.utc();

        const res = await Customer.findOne({
            include: [
                Customer.Addresses,
                Customer.PermanentDiscount,
                {
                    model: CustomerProductDiscount,
                    as: 'productDiscounts',
                    where: {
                        dateExpire: {
                            [Op.gte]: dateNow
                        }
                    },
                }
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

    async updateCustomerRankAndSecretCode(customerId, email, name, rank, transaction = null) {
        const secretCodeHash = await generateSecretCodeHash(email, name);

        return await Customer.update({
            rank,
            secretCode: secretCodeHash
        }, {
            where: { id: customerId },
            transaction
        })
    }

    async isCorrectSecretCode(secretCode, secretCodeHash) {
        return await bcrypt.compare(secretCode, secretCodeHash);
    }
}

const generateSecretCodeHash = async (email, name) => {
    const secretCode = generator.generate({
        length: 10,
        numbers: true,
        lowercase: true,
        uppercase: true,
        strict: true
    });

    const salt = await bcrypt.genSalt(saltRounds);
    const secretCodeHash = await bcrypt.hash(secretCode, salt);

    await emailService.main(email, name, secretCode);

    return secretCodeHash;
}

module.exports = (() => {
    if (isNil(instance)) {
        instance = new CustomerService();
    }

    return instance;
})();