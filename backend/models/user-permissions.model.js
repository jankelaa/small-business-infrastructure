'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class UserPermissions extends Model {
        static associate(models) {
            UserPermissions.User = UserPermissions.belongsTo(models.User, {
                foreignKey: {
                    name: 'userId'
                },
                as: 'user',
                onDelete: 'CASCADE'
            });
        }
    }

    UserPermissions.init({
        superAdmin: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        admin: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        users: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        customers: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        orders: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        products: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        }
    }, {
        sequelize,
        timestamps: false,
        modelName: 'UserPermissions',
        tableName: 'users-permissions'
    });

    return UserPermissions;
};