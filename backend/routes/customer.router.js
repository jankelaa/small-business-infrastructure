const { Router } = require("express");
const { isNil } = require("lodash");
const Joi = require('joi');

const { sequelize } = require('../models');

const customerService = require('../services/customer.service');
const productService = require('../services/product.service');
const CustomerForOrder = require("../models/response-models/customer-for-order.model");

const enums = require('../enums/enums');
const CustomerFull = require("../models/response-models/customer-full.model");
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

        customer = await customerService.customerSignup(name, pib, email, phone, address,
            country, city, postcode, customerRank, transaction);

        const data = { customer: new CustomerForOrder(customer) };

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

        const isSecretCodeValid = await customerService.isCorrectSecretCode(secretCode, customer.secretCode);

        if (!isSecretCodeValid) {
            res.status(400).send(errorMessage);
            return;
        }

        const data = { customer: new CustomerForOrder(customer) };

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
            res.status(400).send(`Customer not found, customerId ${customerId}.`);
            return;
        }

        const permanentDiscount = await customerService.addPermanentDiscountForCustomer(customerId, percentage, transaction);

        if (customer.rank === customerRanks.PENDING) {
            await customerService.updateCustomerRankAndSecretCode(customer.id, customer.email, customer.name,
                customerRanks.PARTNER, transaction);
        } else if ((customer.rank === customerRanks.VERIFIED)) {
            await customerService.upgradeCustomerRank(customer.id, customerRanks.PARTNER, transaction);
        }

        const data = {
            permanentDiscountPercentage: parseFloat(permanentDiscount.percentage)
        };

        await transaction.commit();

        return res.status(200).send(data);
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
        const customers = await customerService.getAllCustomers();

        const data = { customers }

        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json(error);
    }
});

router.get('/filter', async (req, res) => {
    try {
        const validationSchema = Joi.object().keys({
            filterValue: Joi.string()
        })

        const validate = validationSchema.validate(req.query);

        if (!isNil(validate.error)) {
            res.status(400).send(new ErrorResponse(validate.error.message));
            return;
        }

        const { filterValue } = req.query;

        const customers = await customerService.getFilteredCustomers(filterValue);

        const data = {
            customers
        }

        res.status(200).send(data);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

router.get('/:customerId', async (req, res) => {
    try {
        const { customerId } = req.params;

        const customer = await customerService.getCustomerWithAllById(customerId);

        const data = {
            customer: new CustomerFull(customer)
        }

        res.status(200).send(data);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

module.exports = router;