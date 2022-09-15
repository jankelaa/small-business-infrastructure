const { isNil } = require('lodash');
const { Category } = require('../models');

let instance = null;

class CategoryService {
    async findCategoryById(categoryId) {
        return await Category.findByPk(categoryId);
    }

    async getAllCategories() {
        return await Category.findAll();
    }

    // async insertCategory(name, transaction = null) {
    // }
}

module.exports = (() => {
    if (isNil(instance)) {
        instance = new CategoryService();
    }

    return instance;
})();