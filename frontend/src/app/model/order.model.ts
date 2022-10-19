export class Order {
    id: number;
    totalPrice: number;
    status: number;
    statusString: string;
    isPaid: boolean;
    isPaidString: string;
    createdAt: Date;
    updatedAt: Date;
    customer: {
        id: number;
        name: string;
        pib: number;
        email: string;
        rank: number;
    };
    customerAddress: {
        id: number;
        address: string;
        city: string;
        country: string;
        zipCode: string;
        isMain: boolean;
    };
}