'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CustomerAddress extends Model {
    static associate(models) {
      CustomerAddress.belongsTo(models.Customer, {
        foreignKey: {
          name: 'customerId',
          allowNull: false
        },
        as: 'Customer',
        onDelete: 'CASCADE'
      });
    }
  }
  CustomerAddress.init({
    address: {
      type: DataTypes.STRING,
      allowNull: false
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false
    },
    zipCode: {
      type: DataTypes.STRING,
      allowNull: false
    },
    isMain: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    }
  }, {
    sequelize,
    timestamps: false,
    tableName: 'customer-addresses',
    modelName: 'CustomerAddress',
  });
  return CustomerAddress;
};