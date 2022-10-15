const { Router } = require("express");
const { isNil } = require("lodash");
const Joi = require('joi');

const { Customer, sequelize } = require('../models');

const customerService = require('../services/customer.service');
const productService = require('../services/product.service');
const CustomerWithAddresses = require("../models/response-models/customer-with-address.model");

const enums = require('../enums/enums');
const customerRanks = enums.customerRanks;

const router = Router();

router.post('/create', async (req, res) => {
    let transaction;

    try {
        const validationSchema = Joi.object().keys({
            name: Joi.string().required(),
            pib: Joi.number().integer().required(),
            email: Joi.string().email().required(),
            phone: Joi.string().required(),
            address: Joi.string().required(),
            country: Joi.string().required(),
            city: Joi.string().required(),
            postcode: Joi.string().required()
        });

        const validate = validationSchema.validate(req.body);

        if (!isNil(validate.error)) {
            res.status(400).send(validate.error.message);
            return;
        }

        const { name, pib, email, phone, address, country, city, postcode } = req.body;

        transaction = await sequelize.transaction();

        let customer = await customerService.getCustomerByPibOrEmail(pib, email, transaction);

        const customerRank = customerRanks.VERIFIED;

        if (!isNil(customer)) {
            await transaction.commit();
            res.status(400).send('PIB and email for customer must be unique.');
            return;
        }

        customer = await customerService.createCustomer(name, pib, email, phone, address,
            country, city, postcode, customerRank, transaction);

        await transaction.commit();
        return res.status(200).json(customer);
    } catch (error) {
        transaction.rollback();
        res.status(500).send(error.message);
    }
});

router.post('/signup', async (req, res) => {
    let transaction;

    try {
        const validationSchema = Joi.object().keys({
            name: Joi.string().required(),
            pib: Joi.number().integer().required(),
            email: Joi.string().email().required(),
            phone: Joi.string().required(),
            address: Joi.string().required(),
            country: Joi.string().required(),
            city: Joi.string().required(),
            postcode: Joi.string().required()
        });

        const validate = validationSchema.validate(req.body);

        if (!isNil(validate.error)) {
            res.status(400).send(validate.error.message);
            return;
        }

        const { name, pib, email, phone, address, country, city, postcode } = req.body;

        transaction = await sequelize.transaction();

        let customer = await customerService.getCustomerByPibOrEmail(pib, email, transaction);

        if (!isNil(customer)) {
            await transaction.commit();
            res.status(400).send('PIB and email for customer must be unique.');
            return;
        }

        const customerRank = customerRanks.PENDING;

        customer = await customerService.createCustomer(name, pib, email, phone, address,
            country, city, postcode, customerRank, transaction);

        const data = { customer: new CustomerWithAddresses(customer) }

        await transaction.commit();

        return res.status(200).json(data);
    } catch (error) {
        transaction.rollback();
        res.status(500).send(error.message);
    }
});

router.post('/signin', async (req, res) => {
    try {
        const validationSchema = Joi.object().keys({
            pib: Joi.number().integer().required(),
            secretCode: Joi.string().required()
        });

        const validate = validationSchema.validate(req.body);

        if (!isNil(validate.error)) {
            res.status(400).send(validate.error.message);
            return;
        }

        const { pib, secretCode } = req.body;

        const customer = await customerService.getCustomerForOrderByPib(pib);

        let errorMessage = 'Signin credentials not valid.';

        if (isNil(customer)) {
            res.status(400).send(errorMessage);
            return;
        }

        // const isPasswordValid = await userService.isCorrectPassword(password, user.password);
        const isSecretCodeValid = secretCode === customer.secretCode;

        if (!isSecretCodeValid) {
            res.status(400).send(errorMessage);
            return;
        }

        const data = { customer: new CustomerWithAddresses(customer) }

        res.status(200).send(data);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

router.post('/address', async (req, res) => {
    let transaction;

    try {
        const validationSchema = Joi.object().keys({
            customerId: Joi.number().integer().required(),
            address: Joi.string().required(),
            country: Joi.string().required(),
            city: Joi.string().required(),
            zipCode: Joi.string().required()
        });

        const validate = validationSchema.validate(req.body);

        if (!isNil(validate.error)) {
            res.status(400).send(validate.error.message);
            return;
        }

        const { customerId, address, country, city, zipCode } = req.body;

        transaction = await sequelize.transaction();

        const customer = await customerService.addAddressForCustomer(customerId, address, country, city, zipCode, transaction);

        await transaction.commit();
        return res.status(200).json(customer);
    } catch (error) {
        transaction.rollback();
        res.status(500).send(error.message);
    }
});

router.post('/discount/permanent', async (req, res) => {
    let transaction;

    try {
        const validationSchema = Joi.object().keys({
            customerId: Joi.number().integer().required(),
            percentage: Joi.number().required()
        });

        const validate = validationSchema.validate(req.body);

        if (!isNil(validate.error)) {
            res.status(400).send(validate.error.message);
            return;
        }

        const { customerId, percentage } = req.body;

        transaction = await sequelize.transaction();

        const customer = await customerService.getCustomerById(customerId, transaction);

        if (isNil(customer)) {
            await transaction.commit();
            res.status(400).send(`Customer with not found, customerId ${customerId}.`);
            return;
        }

        await customerService.addPermanentDiscountForCustomer(customerId, percentage, transaction);

        await transaction.commit();

        return res.status(200).send('Permanent discount successfully added.');
    } catch (error) {
        transaction.rollback();
        res.status(500).send(error.message);
    }
});

router.post('/discount/product', async (req, res) => {
    let transaction;

    try {
        const validationSchema = Joi.object().keys({
            customerId: Joi.number().integer().required(),
            productId: Joi.number().integer().required(),
            percentage: Joi.number().required()
        });

        const validate = validationSchema.validate(req.body);

        if (!isNil(validate.error)) {
            res.status(400).send(validate.error.message);
            return;
        }

        const { customerId, productId, percentage } = req.body;

        transaction = await sequelize.transaction();

        const customer = await customerService.getCustomerById(customerId, transaction);

        if (isNil(customer)) {
            await transaction.commit();
            res.status(400).send(`Customer with not found, customerId ${customerId}.`);
            return;
        }

        const product = await productService.getProductById(productId, transaction);

        if (isNil(product)) {
            await transaction.commit();
            res.status(400).send(`Product with not found, productId ${productId}.`);
            return;
        }

        await customerService.addProductDiscountForCustomer(customerId, productId, percentage, transaction);

        await transaction.commit();

        return res.status(200).send('Product discount successfully added.');
    } catch (error) {
        transaction.rollback();
        res.status(500).send(error.message);
    }
});

router.get('/', async (req, res) => {
    try {
        const customers = await Customer.findAll();

        return res.json(customers);
    } catch (err) {
        console.log(err);
        return res.status(500).json(err);
    }
})

router.route('/:id')
    .get(async (req, res) => {
        const id = req.params.id;
        try {
            const customer = await Customer.findByPk(id);

            return res.json(customer);
        } catch (err) {
            console.log(err);
            return res.status(500).json(err);
        }
    })
    .put(async (req, res) => {
        const id = req.params.id;
        try {
            const customer = await Customer.update(id);

            return res.json(customer);
        } catch (err) {
            console.log(err);
            return res.status(500).json(err);
        }
    })
    .delete(async (req, res) => {
        const id = req.params.id;
        try {
            const isDeleted = await Customer.destroy({
                where: {
                    id,
                    rank: 0
                }
            });

            if (isDeleted) {
                return res.status(200).send(`Customer with id: ${id} is successfully deleted.`);
            } else {
                return res.status(400).send(`Customer with id: ${id} was not found.`);
            }
        } catch (err) {
            console.log(err);
            return res.status(500).json(err);
        }
    })

module.exports = router;