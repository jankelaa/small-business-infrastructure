module.exports = {
    customerRanks: {
        PENDING: 0,
        VERIFIED: 1,
        PARTNER: 2
    },
    orderStatuses: {
        PENDING: 0,
        INCOMPLETE: 1,
        READY: 2,
        DELIVERED: 3,
        COMPLETED: 4,
        CANCELED: 5,
    },
    permissions: {
        SUPER_ADMIN: 'superAdmin',
        ADMIN: 'admin',
        USERS: 'users',
        CUSTOMERS: 'customers',
        ORDERS: 'orders',
        PRODUCTS: 'products'
    }
};