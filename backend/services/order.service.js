const { isNil } = require('lodash');
const { Order, ProductOrder } = require('../models');

let instance = null;

class OrderService {
    async getAllOrders() {
        return Order.findAll();
    }

    async createOrder(customerId, totalPrice, customerAddressId, productsForOrder, transaction = null) {
        const order = await Order.create({
            customerId,
            totalPrice,
            customerAddressId,
            status: 0
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
}

module.exports = (() => {
    if (isNil(instance)) {
        instance = new OrderService();
    }

    return instance;
})();