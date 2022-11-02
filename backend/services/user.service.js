const { isNil } = require('lodash');
const { User } = require('../models');
const bcrypt = require('bcrypt');

const saltRounds = 10;

let instance = null;

class UserService {
    async getUserById(userId) {
        return await User.findByPk(userId);
    }

    async getUserWithAllById(id, transaction = null) {
        return await User.findByPk(id, { transaction });
    }

    async getAllUsers() {
        return await User.findAll();
    }

    async createUser(username, password, email, name, surname, phone, transaction = null) {
        const passwordHash = await generatePasswordHash(password);

        return await User.create({
            username,
            password: passwordHash,
            email,
            name,
            surname,
            phone
        }, {
            transaction
        });
    }

    async findUserWithPermissionsByUsername(username, transaction = null) {
        return await User.findOne({
            where: { username },
            transaction
        });
    }

    async isCorrectPassword(password, hashPassword) {
        return await bcrypt.compare(password, hashPassword);
    }

    getUsernameFromEmail(email) {
        return email.split('@')[0];
    }
}

const generatePasswordHash = async password => {
    const salt = await bcrypt.genSalt(saltRounds);
    return await bcrypt.hash(password, salt);
}

module.exports = (() => {
    if (isNil(instance)) {
        instance = new UserService();
    }

    return instance;
})();