const { Router } = require("express");
const Joi = require('joi');
const { isNil } = require("lodash");
const { sequelize } = require("../models");

const router = Router();

const userService = require('../services/user.service');
const { handleResponseException } = require("../utils");

router.get('/', async (req, res) => {
    try {
        const users = await userService.getAllUsers();

        res.status(200).send(users);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

router.post('/create', async (req, res) => {
    let transaction;

    try {
        const validationSchema = Joi.object().keys({
            email: Joi.string().email().required(),
            password: Joi.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/).required(),
            name: Joi.string(),
            surname: Joi.string(),
            phone: Joi.string().regex(/^\d+$/)
        });

        const validate = validationSchema.validate(req.body);

        if (!isNil(validate.error)) {
            res.status(400).send(validate.error.message);
            return;
        }

        transaction = await sequelize.transaction();

        const { email, password, name, surname, phone } = req.body;

        const username = userService.getUsernameFromEmail(email);

        const user = await userService.createUser(username, password, email, name, surname, phone, transaction);

        await transaction.commit();

        res.status(200).send(user);
    } catch (error) {
        transaction.rollback();
        res.status(500).send(error.message);
    }
});

router.get('/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await userService.findUserById(userId);

        res.status(200).send(user);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

module.exports = router;