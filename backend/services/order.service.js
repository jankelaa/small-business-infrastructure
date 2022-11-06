const { isNil } = require('lodash');
const { Op, where } = require('sequelize');
const { Order, ProductOrder } = require('../models');

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
        totalPrice, customerAddressId, productsForOrder, status, transaction = null) {
        const order = await Order.create({
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

        const productsOrders = productsForOrder.map(pfo => {
            return {
                orderId: order.id,
                productId: pfo.id,
                quantity: pfo.quantity,
                price: pfo.price,
                baseSum: pfo.baseSum,
                permanentDiscount: pfo.permanentDiscount,
                productDiscount: pfo.productDiscount,
                totalWithoutPdv: pfo.totalWithoutPdv,
                pdvAmount: pfo.pdvAmount,
                totalPrice: pfo.totalPrice
            }
        });

        return await ProductOrder.bulkCreate(productsOrders, { transaction })
    }

    async getOrderById(orderId, transaction = null) {
        return await Order.findOne({
            where: { id: orderId },
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
}

module.exports = (() => {
    if (isNil(instance)) {
        instance = new OrderService();
    }

    return instance;
})();