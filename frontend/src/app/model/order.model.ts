export class Order{
    id: number;
    customerId: number;
    customerAddressId: number;
    totalPrice: number;
    status: number;
    isPaid: boolean;
    createdAt: Date;
    updatedAt: Date;
}