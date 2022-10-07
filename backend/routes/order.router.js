const { Router } = require("express");
const Joi = require('joi');
const { isNil } = require("lodash");
const { sequelize } = require("../models");

const orderService = require("../services/order.service");

const router = Router();

router.get('/', async (req, res) => {
    try {
        const orders = await orderService.getAllOrders();
        const formatedOrders = orders.map(o => {
            return {
                id: o.id,
                customerId: o.customerId,
                customerAddressId: o.customerAddressId,
                totalPrice: o.totalPrice,
                status: o.status,
                isPaid: o.isPaid,
                createdAt: o.createdAt.toLocaleString(),
                updatedAt: o.updatedAt.toLocaleString()
            }
        });

        res.status(200).send(formatedOrders);
    } catch (error) {
        res.status(500).send(error.message);
    }
});
router.post('/create', async (req, res) => {
    let transaction;

    try {
        const validationSchemaCustomer = Joi.object().keys({
            customerId: Joi.number().integer().required(),
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

        const { customerId, totalPrice, customerAddressId, productsForOrder } = req.body;
        console.log(customerId, totalPrice, customerAddressId);
        const order = await orderService.createOrder(customerId, totalPrice, customerAddressId, productsForOrder, transaction);

        await transaction.commit();

        res.status(200).send(order);
    } catch (error) {
        console.log(error);
        transaction.rollback();
        res.status(500).send(error.message);
    }
});

module.exports = router;