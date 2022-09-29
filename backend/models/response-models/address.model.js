class Address {
    constructor(address) {
        this.id = address.id;
        this.address = address.address;
        this.city = address.city;
        this.country = address.country;
        this.zipCode = address.zipCode;
        this.isMain = address.isMain;
    }
}

module.exports = Address;