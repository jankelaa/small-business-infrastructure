'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    static associate(models) {
      Order.Customer = Order.belongsTo(models.Customer, {
        foreignKey: {
          name: 'customerId'
        },
        as: 'customer',
        onDelete: 'RESTRICT'
      });

      Order.CustomerAddress = Order.belongsTo(models.CustomerAddress, {
        foreignKey: {
          name: 'customerAddressId'
        },
        as: 'customerAddress',
        onDelete: 'SET NULL'
      });

      Order.Orders = Order.hasMany(models.ProductOrder, {
        as: 'productOrders',
        foreignKey: 'orderId'
      });

      Order.OrdersMissingProducts = Order.hasMany(models.OrderMissingProduct, {
        as: 'ordersMissingProducts',
        foreignKey: 'orderId'
      });
    }
  }
  Order.init({
    baseAmount: {
      type: DataTypes.DECIMAL(10, 2)
    },
    pdvAmount: {
      type: DataTypes.DECIMAL(10, 2)
    },
    totalAmountWithPdv: {
      type: DataTypes.DECIMAL(10, 2)
    },
    shippingAmount: {
      type: DataTypes.DECIMAL(10, 2)
    },
    shippingAmountWithPdv: {
      type: DataTypes.DECIMAL(10, 2)
    },
    totalPrice: {
      type: DataTypes.DECIMAL(10, 2)
    },
    status: {
      type: DataTypes.SMALLINT,
      allowNull: false
    },
    isPaid: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE
    }
  }, {
    sequelize,
    tableName: 'orders',
    modelName: 'Order',
  });
  return Order;
};