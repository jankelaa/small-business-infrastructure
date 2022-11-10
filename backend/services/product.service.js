const { isNil } = require('lodash');
const csv = require('csv-parser');
const fs = require('fs');
const moment = require('moment');
const { Product, ProductOrder, CustomerProductDiscount, OrderMissingProduct } = require('../models');

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
                .pipe(csv())
                .on('data', (data) => {
                    products.push(data);
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

    async readCsvForStock(file) {
        return new Promise(function (resolve, reject) {
            const products = [];

            fs.createReadStream(file.path)
                .pipe(csv({ skipLines: 1, headers: ['barcode', 'quantity'] }))
                .on('data', (data) => {
                    products.push(data);
                })
                .on('end', () => {
                    resolve(products);
                })
                .on('error', reject);
        })
    }

    async updateStock(products, transaction = null) {
        await Product.bulkCreate(products, {
            upsertKeys: ['barcode'],
            updateOnDuplicate: ['amountAvailable'],
            transaction
        });
    }

    async addProductDiscounts(file, transaction = null) {
        return new Promise(function (resolve, reject) {
            const productDiscounts = [];
            const nextMonthDate = moment.utc().add(1, 'months');

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
                            percentage: pd.percentage,
                            dateExpire: nextMonthDate
                        }, {
                            upsertKeys: ['customerId', 'productId'],
                            updateOnDuplicate: ['percentage', 'dateExpire'],
                            transaction
                        });
                        resolve(productDiscounts);
                    });
                })
                .on('error', reject);
        })
    }

    async getProductsForOrder(orderId, transaction = null) {
        return await ProductOrder.findAll({
            where: { orderId },
            include: {
                model: Product,
                as: 'product',
                include: {
                    model: OrderMissingProduct,
                    as: 'ordersMissingProducts',
                    required: false,
                    where: { orderId }
                }
            },
            transaction
        })
    }

    async removeMissingProductsForOrder(orderId, transaction = null) {
        await OrderMissingProduct.destroy({
            where: { orderId },
            transaction
        });
    }

    async getProductsByProductIds(productIds, transaction = null) {
        return await Product.findAll({
            where: {
                id: productIds
            },
            raw: true,
            transaction
        });
    }

    async getProductsByProductsBarcodes(barcodes, transaction = null) {
        return await Product.findAll({
            where: {
                barcode: barcodes
            },
            raw: true,
            transaction
        });
    }
}

module.exports = (() => {
    if (isNil(instance)) {
        instance = new ProductService();
    }

    return instance;
})();