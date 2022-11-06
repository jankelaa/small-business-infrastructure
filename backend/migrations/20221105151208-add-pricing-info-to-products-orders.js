'use strict';

const productsOrdersTableName = 'products-orders';

const baseSumColumn = 'baseSum';
const permanentDiscountColumn = 'permanentDiscount';
const productDiscountColumn = 'productDiscount';
const totalWithoutPdvColumn = 'totalWithoutPdv';
const pdvAmountColumn = 'pdvAmount';

module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      await queryInterface.addColumn(productsOrdersTableName, baseSumColumn, {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0
      }, { transaction });

      await queryInterface.addColumn(productsOrdersTableName, permanentDiscountColumn, {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0
      }, { transaction });

      await queryInterface.addColumn(productsOrdersTableName, productDiscountColumn, {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0
      }, { transaction });

      await queryInterface.addColumn(productsOrdersTableName, totalWithoutPdvColumn, {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0
      }, { transaction });

      await queryInterface.addColumn(productsOrdersTableName, pdvAmountColumn, {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0
      }, { transaction });

      await queryInterface.changeColumn(productsOrdersTableName, baseSumColumn, {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      }, { transaction });

      await queryInterface.changeColumn(productsOrdersTableName, permanentDiscountColumn, {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      }, { transaction });

      await queryInterface.changeColumn(productsOrdersTableName, productDiscountColumn, {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      }, { transaction });

      await queryInterface.changeColumn(productsOrdersTableName, totalWithoutPdvColumn, {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      }, { transaction });

      await queryInterface.changeColumn(productsOrdersTableName, pdvAmountColumn, {
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
      await queryInterface.removeColumn(productsOrdersTableName, baseSumColumn, { transaction });
      await queryInterface.removeColumn(productsOrdersTableName, permanentDiscountColumn, { transaction });
      await queryInterface.removeColumn(productsOrdersTableName, productDiscountColumn, { transaction });
      await queryInterface.removeColumn(productsOrdersTableName, totalWithoutPdvColumn, { transaction });
      await queryInterface.removeColumn(productsOrdersTableName, pdvAmountColumn, { transaction });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
};
