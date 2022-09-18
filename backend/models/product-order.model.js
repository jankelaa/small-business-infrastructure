'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class ProductOrder extends Model {
        static associate(models) {
            ProductOrder.belongsTo(models.Product, {
                foreignKey: {
                    name: 'productId',
                    allowNull: false
                },
                as: 'Product',
                onDelete: 'CASCADE'
            });

            ProductOrder.belongsTo(models.Order, {
                foreignKey: {
                    name: 'orderId',
                    allowNull: false
                },
                as: 'Order',
                onDelete: 'CASCADE'
            });
        }
    }
    ProductOrder.init({
        price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        sequelize,
        timestamps: false,
        tableName: 'products-orders',
        modelName: 'ProductOrder',
    });
    return ProductOrder;
};