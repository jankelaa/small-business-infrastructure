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

        const orders = await orderService.getFilteredOrders(filterValue);
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

        const status = customer.rank === customerRanks.PENDING ? orderStatuses.PENDING : orderStatuses.INCOMPLETE;

        const order = await orderService.createOrder(customerId, baseAmount, pdvAmount, totalAmountWithPdv,
            shippingAmount, shippingAmountWithPdv, totalPrice, customerAddressId, status, transaction);

        await orderService.addProductsForOrder(order.id, productsForOrder, transaction);

        if (status === orderStatuses.INCOMPLETE) {
            const missingProducts = await updateProductSupplyOnCreateOrder(order.id, productsForOrder, transaction);

            if (missingProducts.length == 0) {
                await orderService.updateOrderStatus(order.id, orderStatuses.READY, transaction);
            } else {
                await orderService.updateOrderStatus(order.id, orderStatuses.INCOMPLETE, transaction);
                await orderService.addMissingProductsForOrder(missingProducts, transaction);
            }
        }

        await transaction.commit();

        res.status(200).send(order);
    } catch (error) {
        transaction.rollback();
        res.status(500).send(error.message);
    }
});

router.post('/approve', async (req, res) => {
    let transaction;

    try {
        const validationSchemaCustomer = Joi.object().keys({
            orderId: Joi.number().integer().required()
        });

        const validate = validationSchemaCustomer.validate(req.body);

        if (!isNil(validate.error)) {
            res.status(400).send(validate.error.message);
            return;
        }

        transaction = await sequelize.transaction();

        const { orderId } = req.body;

        const order = await orderService.getOrderWithCustomerById(orderId, transaction);

        if (isNil(order)) {
            await transaction.commit();
            res.status(400).send(`Order not found, orderId ${orderId}`);
            return;
        }

        if (order.status !== orderStatuses.PENDING) {
            await transaction.commit();
            res.status(400).send(`Order already approved or canceled, orderId ${orderId}`);
            return;
        }

        const productsForOrder = await productService.getProductsForOrder(orderId, transaction);

        const missingProducts = await updateProductSupplyOnApproveOrder(orderId, productsForOrder, transaction);

        if (missingProducts.length == 0) {
            await orderService.updateOrderStatus(orderId, orderStatuses.READY, transaction);
        } else {
            await orderService.updateOrderStatus(orderId, orderStatuses.INCOMPLETE, transaction);
            await orderService.addMissingProductsForOrder(missingProducts, transaction);
        }

        if (order.customer.rank === customerRanks.PENDING) {
            await customerService.updateCustomerRankAndSecretCode(order.customer.id, order.customer.email,
                order.customer.name, customerRanks.VERIFIED, transaction);
        }

        await transaction.commit();

        res.status(200).send('Order successfully confirmed.');
    } catch (error) {
        transaction.rollback();
        res.status(500).send(error.message);
    }
});

router.post('/complete', async (req, res) => {
    let transaction;

    try {
        const validationSchemaCustomer = Joi.object().keys({
            orderId: Joi.number().integer().required()
        });

        const validate = validationSchemaCustomer.validate(req.body);

        if (!isNil(validate.error)) {
            res.status(400).send(validate.error.message);
            return;
        }

        transaction = await sequelize.transaction();

        const { orderId } = req.body;

        const order = await orderService.getOrderWithCustomerById(orderId, transaction);

        if (isNil(order)) {
            await transaction.commit();
            res.status(400).send(`Order not found, orderId ${orderId}`);
            return;
        }

        if (order.status !== orderStatuses.INCOMPLETE) {
            await transaction.commit();
            res.status(400).send(`Order is not incomplete, orderId ${orderId}`);
            return;
        }

        await orderService.updateOrderStatus(orderId, orderStatuses.READY, transaction);
        await productService.removeMissingProductsForOrder(orderId, transaction);

        await transaction.commit();

        res.status(200).send('Order successfully confirmed.');
    } catch (error) {
        transaction.rollback();
        res.status(500).send(error.message);
    }
});

router.post('/cancel', async (req, res) => {
    let transaction;

    try {
        const validationSchemaCustomer = Joi.object().keys({
            orderId: Joi.number().integer().required()
        });

        const validate = validationSchemaCustomer.validate(req.body);

        if (!isNil(validate.error)) {
            res.status(400).send(validate.error.message);
            return;
        }

        transaction = await sequelize.transaction();

        const { orderId } = req.body;

        const order = await orderService.getOrderWithProductsById(orderId, transaction);

        if (isNil(order)) {
            await transaction.commit();
            res.status(400).send(`Order not found, orderId ${orderId}`);
            return;
        }

        if (order.status === orderStatuses.CANCELED || order.status === orderStatuses.COMPLETED) {
            await transaction.commit();
            res.status(400).send(`Order already approved or canceled, orderId ${orderId}`);
            return;
        }

        await orderService.updateOrderStatus(orderId, orderStatuses.CANCELED, transaction);

        let product;
        let quantity;

        const productIds = [];

        if (order.status === orderStatuses.PENDING) {
            await transaction.commit();
            res.status(200).send('Order has been canceled.');
        }

        const productsToRestore = order.orderProducts.map(op => {
            product = order.ordersMissingProducts.find(omp => omp.productId == op.productId);

            if (isNil(product)) {
                quantity = op.quantity;
            } else {
                quantity = op.quantity - product.quantity;
            }

            if (quantity != 0) {
                productIds.push(op.productId);

                return {
                    id: op.productId,
                    quantity
                };
            }
        });

        if (productIds.length === 0) {
            await transaction.commit();
            res.status(200).send('Order has been canceled.');
        }

        const allProducts = await productService.getProductsByProductIds(productIds, transaction);

        const updatedProducts = productsToRestore.map(ptr => {
            product = allProducts.find(ap => ap.id === ptr.id);

            product.amountAvailable = product.amountAvailable + ptr.quantity;

            return product;
        });

        await productService.updateStock(updatedProducts, transaction);

        await productService.removeMissingProductsForOrder(orderId, transaction);

        await transaction.commit();

        res.status(200).send('Order has been canceled.');
    } catch (error) {
        transaction.rollback();
        res.status(500).send(error.message);
    }
});

router.get('/:orderId', async (req, res) => {
    try {
        const { orderId } = req.params;

        const order = await orderService.getOrderWithCustomerAndAdress(orderId);
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

const updateProductSupplyOnCreateOrder = async (orderId, productsForOrder, transaction) => {
    const productsForOrderIds = productsForOrder.map(pfo => pfo.id);

    const allProducts = await productService.getProductsByProductIds(productsForOrderIds, transaction);

    const missingProducts = [];
    let product;

    const updatedProducts = productsForOrder.map(pfo => {
        product = allProducts.find(ap => ap.id === pfo.id);
        if (product.amountAvailable - pfo.quantity >= 0) {
            product.amountAvailable = product.amountAvailable - pfo.quantity;
        } else {
            missingProducts.push({
                orderId: orderId,
                productId: product.id,
                quantity: pfo.quantity - product.amountAvailable
            });

            product.amountAvailable = 0;
        }

        return product;
    });

    await productService.updateStock(updatedProducts, transaction);

    return missingProducts;
}

const updateProductSupplyOnApproveOrder = async (orderId, productsForOrder, transaction) => {
    const missingProducts = [];
    let product;

    const updatedProducts = productsForOrder.map(pfo => {
        product = pfo.product.dataValues;

        if (product.amountAvailable - pfo.quantity >= 0) {
            product.amountAvailable = product.amountAvailable - pfo.quantity;
        } else {
            missingProducts.push({
                orderId: orderId,
                productId: product.id,
                quantity: pfo.quantity - product.amountAvailable
            });

            product.amountAvailable = 0;
        }

        return product;
    });

    await productService.updateStock(updatedProducts, transaction);

    return missingProducts;
}

module.exports = router;