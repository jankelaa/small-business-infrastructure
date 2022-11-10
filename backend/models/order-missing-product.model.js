'use strict';
const {
    Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class OrderMissingProduct extends Model {
        static associate(models) {
            OrderMissingProduct.belongsTo(models.Product, {
                foreignKey: {
                    name: 'productId',
                    allowNull: false
                },
                as: 'product',
                onDelete: 'RESTRICT'
            });

            OrderMissingProduct.belongsTo(models.Order, {
                foreignKey: {
                    name: 'orderId',
                    allowNull: false
                },
                as: 'order',
                onDelete: 'CASCADE'
            });
        }
    }
    OrderMissingProduct.init({
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        sequelize,
        timestamps: false,
        tableName: 'orders-missing-products',
        modelName: 'OrderMissingProduct',
    });
    return OrderMissingProduct;
};