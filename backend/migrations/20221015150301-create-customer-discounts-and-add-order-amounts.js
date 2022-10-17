'use strict';

const customerPermanentDiscountsTableName = 'customer-permanent-discounts';
const customerProductDiscountsTableName = 'customer-product-discounts';
const ordersTableName = 'orders';

const baseAmountColumn = 'baseAmount';
const pdvAmount = 'pdvAmount';
const totalAmountWithPdvColumn = 'totalAmountWithPdv';
const shippingAmountColumn = 'shippingAmount';
const shippingAmountWithPdvColumn = 'shippingAmountWithPdv';

module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      await queryInterface.createTable(customerPermanentDiscountsTableName, {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        customerId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          unique: true,
          references: {
            model: 'customers',
            key: 'id'
          },
          onDelete: 'CASCADE'
        },
        percentage: {
          type: Sequelize.DECIMAL(5, 2),
          allowNull: false
        }
      }, { transaction });

      await queryInterface.createTable(customerProductDiscountsTableName, {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        customerId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          uniqueKeys: 'customer_product_unique',
          references: {
            model: 'customers',
            key: 'id'
          },
          onDelete: 'CASCADE'
        },
        productId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          uniqueKeys: 'customer_product_unique',
          references: {
            model: 'categories',
            key: 'id'
          },
          onDelete: 'CASCADE'
        },
        percentage: {
          type: Sequelize.DECIMAL(5, 2),
          allowNull: false
        }
      }, {
        uniqueKeys: {
          customer_product_unique: {
            fields: ['customerId', 'productId']
          }
        }, transaction
      });

      await queryInterface.addColumn(ordersTableName, baseAmountColumn, {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0
      }, { transaction });

      await queryInterface.addColumn(ordersTableName, pdvAmount, {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0
      }, { transaction });

      await queryInterface.addColumn(ordersTableName, totalAmountWithPdvColumn, {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0
      }, { transaction });

      await queryInterface.addColumn(ordersTableName, shippingAmountColumn, {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0
      }, { transaction });

      await queryInterface.addColumn(ordersTableName, shippingAmountWithPdvColumn, {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0
      }, { transaction });

      await queryInterface.changeColumn(ordersTableName, baseAmountColumn, {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      }, { transaction });

      await queryInterface.changeColumn(ordersTableName, pdvAmount, {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      }, { transaction });

      await queryInterface.changeColumn(ordersTableName, totalAmountWithPdvColumn, {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      }, { transaction });

      await queryInterface.changeColumn(ordersTableName, shippingAmountColumn, {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      }, { transaction });

      await queryInterface.changeColumn(ordersTableName, shippingAmountWithPdvColumn, {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      }, { transaction });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  async down(queryInterface) {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      await queryInterface.removeColumn(ordersTableName, baseAmountColumn, { transaction });
      await queryInterface.removeColumn(ordersTableName, pdvAmount, { transaction });
      await queryInterface.removeColumn(ordersTableName, totalAmountWithPdvColumn, { transaction });
      await queryInterface.removeColumn(ordersTableName, shippingAmountColumn, { transaction });
      await queryInterface.removeColumn(ordersTableName, shippingAmountWithPdvColumn, { transaction });

      await queryInterface.dropTable(customerPermanentDiscountsTableName, { transaction });
      await queryInterface.dropTable(customerProductDiscountsTableName, { transaction });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
};
