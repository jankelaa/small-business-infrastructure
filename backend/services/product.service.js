const { isNil } = require('lodash');
const csv = require('csv-parser');
const fs = require('fs');
const { Product, ProductOrder, CustomerProductDiscount } = require('../models');

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

    async addProductDiscounts(file, transaction = null) {
        return new Promise(function (resolve, reject) {
            const productDiscounts = [];

            fs.createReadStream(file.path)
                .pipe(csv({}))
                .on('data', (data) => {
                    productDiscounts.push(data)
                })
                .on('end', () => {
                    productDiscounts.forEach(async pd => {
                        await CustomerProductDiscount.create({
                            customerId: pd.customerId,
                            productId: pd.productId,
                            percentage: pd.percentage
                        }, {
                            upsertKeys: ['customerId', 'productId'],
                            updateOnDuplicate: ['percentage'],
                            transaction
                        });
                        resolve(productDiscounts);
                    });
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