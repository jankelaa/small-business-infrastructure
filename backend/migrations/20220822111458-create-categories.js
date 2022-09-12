'use strict';

const tableName = 'categories';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable(tableName, {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      // imgUrl: {
      //   type: Sequelize.STRING(1000)
      // }
    });
  },

  async down (queryInterface) {
    await queryInterface.dropTable(tableName);
  }
};
