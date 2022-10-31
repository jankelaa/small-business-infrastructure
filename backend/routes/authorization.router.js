const { Router } = require("express");
const Joi = require("joi");
const { isNil } = require("lodash");

const userService = require("../services/user.service");

const router = Router();

router.post('/login', async (req, res) => {
    try {
        const validationSchema = Joi.object().keys({
            username: Joi.string().required(),
            password: Joi.string().required()
        });

        const validate = validationSchema.validate(req.body);

        if (!isNil(validate.error)) {
            res.status(400).send(validate.error.message);
            return;
        }

        const { username, password } = req.body;

        const user = await userService.findUserWithPermissionsByUsername(username);

        let errorMessage = 'Login credentials not valid.';

        if (isNil(user)) {
            res.status(400).send(errorMessage);
            return;
        }

        const isPasswordValid = await userService.isCorrectPassword(password, user.password);

        if (!isPasswordValid) {
            res.status(400).send(errorMessage);
            return;
        }

        res.status(200).send(user);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

module.exports = router;