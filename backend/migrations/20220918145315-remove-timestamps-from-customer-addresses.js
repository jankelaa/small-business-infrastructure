'use strict';

const tableName = 'customer-addresses';

const createdAtColumnName = 'createdAt';
const updatedAtColumnName = 'updatedAt';

module.exports = {
  async up(queryInterface) {
    await queryInterface.removeColumn(tableName, createdAtColumnName);
    await queryInterface.removeColumn(tableName, updatedAtColumnName);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn(tableName, createdAtColumnName, {
      allowNull: false,
      type: Sequelize.DATE
    });
    await queryInterface.addColumn(tableName, updatedAtColumnName, {
      allowNull: false,
      type: Sequelize.DATE
    });
  }
};
