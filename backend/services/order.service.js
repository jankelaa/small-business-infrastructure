const { isNil } = require('lodash');
const { Op, where } = require('sequelize');
const { orderStatuses } = require('../enums/enums');
const { Order, ProductOrder, OrderMissingProduct } = require('../models');

let instance = null;

class OrderService {
    async getAllOrders() {
        return Order.findAll({
            include: [
                Order.Customer,
                Order.CustomerAddress
            ],
            order: [
                ['createdAt', 'DESC']
            ]
        });
    }

    async getFilteredOrders(filterValue) {
        let where = {};

        if (!isNaN(filterValue)) {
            where = {
                ...where,
                [Op.or]: [
                    {
                        id: parseInt(filterValue)
                    },
                    {
                        '$customer.name$': { [Op.iLike]: `%${filterValue}%` }
                    }
                ]
            }
        } else {
            where = {
                ...where,
                '$customer.name$': { [Op.iLike]: `%${filterValue}%` }
            }
        }

        return Order.findAll({
            include: [
                Order.Customer,
                Order.CustomerAddress
            ],
            where,
            order: [
                ['createdAt', 'DESC']
            ]
        });
    }

    async createOrder(customerId, baseAmount, pdvAmount, totalAmountWithPdv, shippingAmount, shippingAmountWithPdv,
        totalPrice, customerAddressId, status, transaction = null) {
        return await Order.create({
            customerId,
            baseAmount,
            pdvAmount,
            totalAmountWithPdv,
            shippingAmount,
            shippingAmountWithPdv,
            totalPrice,
            customerAddressId,
            status
        }, {
            transaction
        });
    }

    async addProductsForOrder(orderId, productsForOrder, transaction = null) {
        const orderProducts = productsForOrder.map(op => {
            return {
                orderId: orderId,
                productId: op.id,
                quantity: op.quantity,
                price: op.price,
                baseSum: op.baseSum,
                permanentDiscount: op.permanentDiscount,
                productDiscount: op.productDiscount,
                totalWithoutPdv: op.totalWithoutPdv,
                pdvAmount: op.pdvAmount,
                totalPrice: op.totalPrice
            }
        });

        return await ProductOrder.bulkCreate(orderProducts, { transaction })
    }

    async getOrderWithProductsById(orderId, transaction = null) {
        return await Order.findOne({
            where: { id: orderId },
            include:
                [
                    Order.Products,
                    Order.OrdersMissingProducts
                ],
            transaction
        });
    }

    async getOrderWithCustomerById(orderId, transaction = null) {
        return await Order.findOne({
            where: { id: orderId },
            include: [
                Order.Customer
            ],
            transaction
        });
    }

    async getOrderWithCustomerAndAdress(orderId) {
        return await Order.findOne({
            where: { id: orderId },
            include: [
                Order.Customer,
                Order.CustomerAddress
            ]
        });
    }

    async updateOrderStatus(orderId, status, transaction = null) {
        return await Order.update({
            status
        }, {
            where: { id: orderId },
            transaction
        });
    }

    async addMissingProductsForOrder(missingProducts, transaction = null) {
        await OrderMissingProduct.bulkCreate(missingProducts, { transaction });
    }
}

module.exports = (() => {
    if (isNil(instance)) {
        instance = new OrderService();
    }

    return instance;
})();