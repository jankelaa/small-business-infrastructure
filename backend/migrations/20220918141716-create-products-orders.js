'use strict';

const tableName = 'products-orders';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(tableName, {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      productId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: 'products'
          },
          key: 'id'
        },
        onDelete: 'RESTRICT'
      },
      orderId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: 'orders'
          },
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false
      }
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable(tableName);
  }
};