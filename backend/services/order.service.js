const { isNil } = require('lodash');
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
                price: pfo.price
            }
        })

        return await ProductOrder.bulkCreate(productsOrders, { transaction })
    }

    async getOrderInfoById(orderId) {
        return await Order.findOne({
            where: { id: orderId },
            include: [
                Order.Customer,
                Order.CustomerAddress
            ]
        });
    }
}

module.exports = (() => {
    if (isNil(instance)) {
        instance = new OrderService();
    }

    return instance;
})();