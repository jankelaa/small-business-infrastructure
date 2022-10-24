'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Customer extends Model {
    static associate(models) {
      Customer.Addresses = Customer.hasMany(models.CustomerAddress, { as: 'addresses', foreignKey: 'customerId' });

      Customer.Orders = Customer.hasMany(models.Order, { as: 'orders', foreignKey: 'customerId' });

      Customer.PermanentDiscount = Customer.hasOne(models.CustomerPermanentDiscount, {
        as: 'permanentDiscount',
        foreignKey: 'customerId'
      });

      Customer.ProductDiscounts = Customer.hasMany(models.CustomerProductDiscount, {
        as: 'productDiscounts',
        foreignKey: 'customerId'
      });
    }
  }
  Customer.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    pib: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    rank: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      defaultValue: 0
    },
    secretCode: {
      type: DataTypes.STRING
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
    tableName: 'customers',
    modelName: 'Customer',
  });
  return Customer;
};