const { isNil } = require('lodash');
const csv = require('csv-parser');
const fs = require('fs');
const { Product, ProductOrder } = require('../models');

let instance = null;

class ProductService {
    async findProductById(productId) {
        return await Product.findByPk(productId);
    }

    async getAllProducts() {
        return await Product.findAll();
    }

    async getProductById(id, transaction = null) {
        return await Product.findByPk(id, { transaction });
    }

    async updateProducts(file, transaction = null) {
        return new Promise(function (resolve, reject) {
            const products = [];

            fs.createReadStream(file.path)
                .pipe(csv({}))
                .on('data', (data) => {
                    products.push(data)
                })
                .on('end', async () => {
                    await Product.bulkCreate(products, {
                        upsertKeys: ['barcode'],
                        updateOnDuplicate: ['name', 'size', 'price'],
                        transaction
                    });
                    resolve(products);
                })
                .on('error', reject);
        })
    }

    async getProductsForOrder(orderId) {
        return await ProductOrder.findAll({
            where: { orderId },
            include: {
                model: Product,
                as: 'product'
            }
        })
    }
}

module.exports = (() => {
    if (isNil(instance)) {
        instance = new ProductService();
    }

    return instance;
})();