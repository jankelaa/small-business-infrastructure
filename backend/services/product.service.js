const { isNil } = require('lodash');
const csv = require('csv-parser');
const fs = require('fs');
const { Product } = require('../models');

let instance = null;

class ProductService {
    async findProductById(productId) {
        return await Product.findByPk(productId);
    }

    async getAllProducts() {
        return await Product.findAll();
    }

    async insertProducts(transaction = null) {
        const products = [];

        fs.createReadStream('../storage/products.csv')
            .pipe(csv({}))
            .on('data', (data) => {
                products.push(data)
            })
            .on('end', async () => await Product.bulkCreate(products, { transaction }));
    }

    async updateProducts(transaction = null) {
        const products = [];

        fs.createReadStream('../storage/products.csv')
            .pipe(csv({}))
            .on('data', (data) => {
                console.log(data);
                products.push(data)
            })
            .on('end', async () => {
                return await Product.bulkCreate(products, {
                    upsertKeys: ['barcode'],
                    updateOnDuplicate: ['name', 'size', 'price'],
                    transaction
                });
            });
    }
}

module.exports = (() => {
    if (isNil(instance)) {
        instance = new ProductService();
    }

    return instance;
})();