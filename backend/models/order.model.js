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
    }
  }
  Order.init({
    totalPrice: {
      type: DataTypes.DECIMAL(10,2)
    },
    status: {
      type: DataTypes.SMALLINT,
      allowNull: false
    },
    isPaid: {
      type: DataTypes.BOOLEAN,
      allowNull: false
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