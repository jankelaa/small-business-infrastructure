const { Router } = require("express");
// const { sequelize } = require("../models");
const categoryService = require("../services/category.service");

const router = Router();

router.get('/', async (req, res) => {
    try {
        const categories = await categoryService.getAllCategories();

        res.status(200).send(categories);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

module.exports = router;