'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class CustomerPermanentDiscount extends Model {
        static associate(models) {
            CustomerPermanentDiscount.belongsTo(models.Customer, {
                foreignKey: {
                    name: 'customerId',
                    allowNull: false
                },
                as: 'Customer',
                onDelete: 'CASCADE'
            });
        }
    }
    CustomerPermanentDiscount.init({
        percentage: {
            type: DataTypes.DECIMAL(5, 2),
            allowNull: false
        }
    }, {
        sequelize,
        timestamps: false,
        tableName: 'customer-permanent-discounts',
        modelName: 'CustomerPermanentDiscount',
    });
    return CustomerPermanentDiscount;
};