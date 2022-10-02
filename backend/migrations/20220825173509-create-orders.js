'use strict';

const tableName = 'orders';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(tableName, {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      customerId: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'customers'
          },
          key: 'id'
        },
        onDelete: 'SET NULL'
      },
      totalPrice: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      customerAddressId: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'customer-addresses'
          },
          key: 'id'
        },
        onDelete: 'SET NULL'
      },
      status: {
        type: Sequelize.SMALLINT,
        allowNull: false
      },
      isPaid: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable(tableName);
  }
};