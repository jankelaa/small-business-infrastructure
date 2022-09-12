'use strict';

const categoriesTableName = 'categories';

const newCategories = [
  { name: "Pavloderm dečja kozmetika" },
  { name: "Pasta za zube" },
  { name: "Proizvodi za negu kože" },
  { name: "Proizvodi za negu kose" },
  { name: "Muška kolekcija za negu kože" },
  { name: "Antibakterijski gel" },
  { name: "Tečni sapuni BELDAM" },
  { name: "Destilovana voda" }
]

module.exports = {
  async up(queryInterface) {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      await queryInterface.bulkInsert(categoriesTableName, newCategories, transaction);

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  async down(queryInterface) {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      await queryInterface.bulkDelete(categoriesTableName, null, transaction
      )
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
};
