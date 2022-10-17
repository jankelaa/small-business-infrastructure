const { Router } = require("express");
const Joi = require('joi');
const { isNil } = require("lodash");
const { sequelize } = require("../models");
const Order = require("../models/response-models/order.model");
const ProductForOrder = require("../models/response-models/products-for-order.model");

const customerService = require("../services/customer.service");
const orderService = require("../services/order.service");
const productService = require("../services/product.service");

const enums = require('../enums/enums');
const customerRanks = enums.customerRanks;
const orderStatuses = enums.orderStatuses;

const router = Router();

router.get('/', async (req, res) => {
    try {
        const orders = await orderService.getAllOrders();
        const formattedOrders = orders.map(o => new Order(o));

        const data = {
            orders: formattedOrders
        }

        res.status(200).send(data);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

router.post('/create', async (req, res) => {
    let transaction;

    try {
        const validationSchemaCustomer = Joi.object().keys({
            customerId: Joi.number().integer().required(),
            baseAmount: Joi.number().required(),
            pdvAmount: Joi.number().required(),
            totalAmountWithPdv: Joi.number().required(),
            shippingAmount: Joi.number().required(),
            shippingAmountWithPdv: Joi.number().required(),
            totalPrice: Joi.number().required(),
            customerAddressId: Joi.number().integer().required(),
            productsForOrder: Joi.array().required()
        });

        const validate = validationSchemaCustomer.validate(req.body);

        if (!isNil(validate.error)) {
            res.status(400).send(validate.error.message);
            return;
        }

        transaction = await sequelize.transaction();

        const { customerId, baseAmount, pdvAmount, totalAmountWithPdv, shippingAmount, shippingAmountWithPdv,
            totalPrice, customerAddressId, productsForOrder } = req.body;

        const customer = await customerService.getCustomerById(customerId, transaction);

        if (isNil(customer)) {
            await transaction.commit();
            res.status(400).send(`Customer not found, id ${customerId}`);
            return;
        }

        const status = customer.rank === customerRanks.PENDING ? orderStatuses.PENDING : orderStatuses.CONFIRMED;

        const order = await orderService.createOrder(customerId, baseAmount, pdvAmount, totalAmountWithPdv,
            shippingAmount, shippingAmountWithPdv, totalPrice, customerAddressId, productsForOrder, status, transaction);

        await transaction.commit();

        res.status(200).send(order);
    } catch (error) {
        console.log(error);
        transaction.rollback();
        res.status(500).send(error.message);
    }
});

router.get('/:orderId', async (req, res) => {
    try {
        const { orderId } = req.params;

        const order = await orderService.getOrderInfoById(orderId);
        const productsForOrder = await productService.getProductsForOrder(orderId);

        const data = {
            order: new Order(order),
            productsForOrder: productsForOrder.map(pfo => new ProductForOrder(pfo))
        }

        res.status(200).send(data);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

module.exports = router;