const { Router } = require("express");
const { Customer, sequelize } = require('../models');

// const customerService = require('../services/customer.service');

const router = Router();

router.post('/signup', async (req, res) => {
    let transaction;

    try {
        const { name, pib, email, address } = req.body;
        
        transaction = await sequelize.transaction();

        const customer = await Customer.create({ name, pib, email, address });

        await transaction.commit();
        return res.status(200).json(customer);
    } catch (error) {
        transaction.rollback();
        res.status(500).send(error.message);
    }
})

router.get('/', async (req, res) => {
    try {
        const customers = await Customer.findAll();

        return res.json(customers);
    } catch (err) {
        console.log(err);
        return res.status(500).json(err);
    }
})

router.route('/:id')
    .get(async (req, res) => {
        const id = req.params.id;
        try {
            const customer = await Customer.findByPk(id);

            return res.json(customer);
        } catch (err) {
            console.log(err);
            return res.status(500).json(err);
        }
    })
    .put(async (req, res) => {
        const id = req.params.id;
        try {
            const customer = await Customer.update(id);

            return res.json(customer);
        } catch (err) {
            console.log(err);
            return res.status(500).json(err);
        }
    })
    .delete(async (req, res) => {
        const id = req.params.id;
        try {
            const isDeleted = await Customer.destroy({
                where: {
                    id,
                    rank: 0
                }
            });

            if (isDeleted) {
                return res.status(200).send(`Customer with id: ${id} is successfully deleted.`);
            } else {
                return res.status(400).send(`Customer with id: ${id} was not found.`);
            }
        } catch (err) {
            console.log(err);
            return res.status(500).json(err);
        }
    })

module.exports = router;