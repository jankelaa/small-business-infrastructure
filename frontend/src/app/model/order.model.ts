export class Order {
    id: number;

    baseAmount: number;
    pdvAmount: number;
    totalAmountWithPdv: number;
    shippingAmount: number;
    shippingAmountWithPdv: number;
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
        rankString: string;
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