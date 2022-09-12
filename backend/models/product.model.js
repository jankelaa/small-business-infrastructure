'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    static associate(models) {
      Product.Category = Product.belongsTo(models.Category, {
        foreignKey: {
          name: 'categoryId',
          // allowNull: false
        },
        as: 'category',
        onDelete: 'SET NULL'
      });
    }
  }
  Product.init({
    barcode: {
      type: DataTypes.STRING(13),
      allowNull: false,
      unique: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    imgUrl: {
      type: DataTypes.STRING(1000)
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    size: {
      type: DataTypes.STRING,
      allowNull: false
    },
    amountAvailable: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    bundleSize: {
      type: DataTypes.INTEGER,
      // allowNull: false
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE
    }
  },
    {
      sequelize,
      tableName: 'products',
      modelName: 'Product',
    });
  return Product;
};