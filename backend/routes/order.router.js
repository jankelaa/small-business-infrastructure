const { Router } = require("express");

const router = Router();

router.get('', (req, res) => {
    res.status(200).send("Order page!");
});

router.post('/create/customer', async (req, res) => {
    let transaction;

    try {
        const validationSchemaCustomer = Joi.object().keys({
            pib: Joi.string().email().required(),
            secretCode: Joi.string().required()
        });

        const validate = validationSchemaCustomer.validate(req.body);

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

module.exports = router;