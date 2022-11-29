export class User {
    id: number;
    username: string;
    password: string;
    email: string;
    name: string;
    surname: string;
    phone: string;
    createdAt: Date;
    updatedAt: Date;

    permissions: {
        id: number;
        superAdmin: boolean;
        admin: boolean;
        users: boolean;
        customers: boolean;
        orders: boolean;
        products: boolean;
    };
}