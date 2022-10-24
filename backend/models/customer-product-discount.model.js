'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class CustomerProductDiscount extends Model {
        static associate(models) {
            CustomerProductDiscount.belongsTo(models.Customer, {
                foreignKey: {
                    name: 'customerId',
                    allowNull: false
                },
                as: 'Customer',
                onDelete: 'CASCADE'
            });

            CustomerProductDiscount.belongsTo(models.Product, {
                foreignKey: {
                    name: 'productId',
                    allowNull: false
                },
                as: 'product',
                onDelete: 'CASCADE'
            });
        }
    }
    CustomerProductDiscount.init({
        percentage: {
            type: DataTypes.DECIMAL(5, 2),
            allowNull: false
        }
    }, {
        sequelize,
        timestamps: false,
        tableName: 'customer-product-discounts',
        modelName: 'CustomerProductDiscount',
    });
    return CustomerProductDiscount;
};