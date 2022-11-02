class UserFull {
    constructor(user) {
        this.id = user.id;
        this.username = user.username;
        this.email = user.email;
        this.name = user.name;
        this.surname = user.surname;
        this.phone = user.phone;
    }
}

module.exports = UserFull;