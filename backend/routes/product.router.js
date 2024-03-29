const { Router } = require("express");
const multer = require('multer');
const { sequelize } = require("../models");
const productService = require("../services/product.service");

const router = Router();

const storageEngine = multer.diskStorage({
    destination: "./uploads",
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}--${file.originalname}`);
    },
});
const upload = multer({
    storage: storageEngine,
});

router.get('/', async (req, res) => {
    try {
        const products = await productService.getAllProducts();

        res.status(200).send(products);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

router.post('/update', upload.single('file'), async (req, res) => {
    let transaction;
    try {
        const file = req.file;

        transaction = await sequelize.transaction();
        await productService.updateProducts(file, transaction);
        await transaction.commit();

        res.status(200).send('Products successfully inserted.');
    } catch (error) {
        transaction.rollback();
        res.status(500).send(error.message);
    }
});

router.post('/stock/update', upload.single('file'), async (req, res) => {
    let transaction;
    try {
        const file = req.file;

        transaction = await sequelize.transaction();

        const productsCsv = await productService.readCsvForStock(file, transaction);

        const productBarcodes = productsCsv.map(pcsv => pcsv.barcode);
        const allProducts = await productService.getProductsByProductsBarcodes(productBarcodes, transaction);

        let product;

        const updatedProducts = productsCsv.map(pcsv => {
            product = allProducts.find(ap => ap.barcode === pcsv.barcode);
            product.amountAvailable = product.amountAvailable + parseInt(pcsv.quantity);

            return product;
        });

        await productService.updateStock(updatedProducts, transaction);

        await transaction.commit();

        res.status(200).send('Stock successfully updated.');
    } catch (error) {
        transaction.rollback();
        res.status(500).send(error.message);
    }
});

router.post('/discounts/add', upload.single('file'), async (req, res) => {
    let transaction;
    try {
        const file = req.file;

        transaction = await sequelize.transaction();
        await productService.addProductDiscounts(file, transaction);
        await transaction.commit();

        res.status(200).send('Product discounts successfully inserted.');
    } catch (error) {
        transaction.rollback();
        res.status(500).send(error.message);
    }
});

router.get('/:id', (req, res) => {
    res.status(200).send("Product page!");
});

module.exports = router;