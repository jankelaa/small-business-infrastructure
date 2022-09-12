'use strict';

const tableName = 'products';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(tableName, {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      barcode: {
        type: Sequelize.STRING(13),
        allowNull: false,
        unique: true
      },
      categoryId: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'categories'
          },
          key: 'id'
        },
        onDelete: 'SET NULL'
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      imgUrl: {
        type: Sequelize.STRING(1000)
      },
      price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      size: {
        type: Sequelize.STRING,
        allowNull: false
      },
      amountAvailable: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      bundleSize: {
        type: Sequelize.INTEGER,
        // allowNull: false
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