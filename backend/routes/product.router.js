const { Router } = require("express");
const { sequelize } = require("../models");
const productService = require("../services/product.service");

const router = Router();

router.get('/', async (req, res) => {
    try {
        const products = await productService.getAllProducts();

        res.status(200).send(products);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

router.post('/update', async (req, res) => {
    let transaction;
    try {
        transaction = await sequelize.transaction();
        // IMPLEMENTIRATI DA SE VRATE UNESENI PROIZVODI
        // IMPLEMENTIRATI KATEGORIJE PROIZVODA? OVDE?
        const products = await productService.updateProducts();

        await transaction.commit();

        res.status(200).send('Products successfully inserted.');
    } catch (error) {
        transaction.rollback();
        res.status(500).send(error.message);
    }
});

router.get('/:id', (req, res) => {
    res.status(200).send("Product page!");
});

module.exports = router;