const { isNil } = require('lodash');
const csv = require('csv-parser');
const fs = require('fs');
const { Readable } = require('stream');
const { Product, ProductOrder } = require('../models');

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

    async updateProducts(file, transaction = null) {
        const products = [];
        const stream = Readable.from(file.buffer);

        stream.pipe(csv({}))
            .on('data', (data) => {
                console.log(data);
                products.push(data)
            })
            .on('end', async () => {
                // console.log(products);
                console.log('HEJ KRAJ JE');
                return await Product.bulkCreate(products, {
                    upsertKeys: ['barcode'],
                    updateOnDuplicate: ['name', 'size', 'price'],
                    transaction
                });
            });
        // fs.createReadStream('../storage/products.csv')
        //     .pipe(csv({}))
        //     .on('data', (data) => {
        //         // console.log(data);
        //         products.push(data)
        //     })
        //     .on('end', async () => {
        //         return await Product.bulkCreate(products, {
        //             upsertKeys: ['barcode'],
        //             updateOnDuplicate: ['name', 'size', 'price'],
        //             transaction
        //         });
        //     });
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