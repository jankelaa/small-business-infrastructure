const { Router } = require("express");
const Joi = require('joi');
const { isNil } = require("lodash");
const { sequelize } = require("../models");

const orderService = require("../services/order.service");

const router = Router();

router.get('', (req, res) => {
    res.status(200).send("Order page!");
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