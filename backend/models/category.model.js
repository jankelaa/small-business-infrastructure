'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Category extends Model {
        static associate(models) {
            // define association here
        }
    }
    Category.init({
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        // imgUrl: {
        //     type: DataTypes.STRING(1000)
        // }
    }, {
        sequelize,
        tableName: 'categories',
        modelName: 'Category',
    });
    return Category;
};