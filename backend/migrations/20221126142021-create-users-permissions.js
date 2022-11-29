'use strict';

const usersPermissionsTable = 'users-permissions';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      await queryInterface.createTable(usersPermissionsTable, {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        userId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          unique: true,
          references: {
            model: {
              tableName: 'users'
            },
            key: 'id'
          },
          onDelete: 'CASCADE'
        },
        superAdmin: {
          type: Sequelize.BOOLEAN,
          allowNull: false
        },
        admin: {
          type: Sequelize.BOOLEAN,
          allowNull: false
        },
        users: {
          type: Sequelize.BOOLEAN,
          allowNull: false
        },
        customers: {
          type: Sequelize.BOOLEAN,
          allowNull: false
        },
        orders: {
          type: Sequelize.BOOLEAN,
          allowNull: false
        },
        products: {
          type: Sequelize.BOOLEAN,
          allowNull: false
        }
      }, { transaction });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  down: async (queryInterface) => {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      await queryInterface.dropTable(usersPermissionsTable, { transaction });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
};
