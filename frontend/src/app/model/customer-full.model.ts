export class CustomerFull {
    id: number;
    name: string;
    pib: number;
    rank: number;
    rankString: string;
    // phone: string;
    email: string;

    addresses: [{
        id: number;
        address: string;
        city: string;
        country: string;
        zipCode: string;
        isMain: boolean;
    }];

    permanentDiscount: number;
    productDiscounts: [{
        id: number;
        percentage: number;
        product: {
            id: number;
            barcode: string;
            categoryId: number;
            name: string;
            imgUrl: string;
            price: number;
            size: string;
            amountAvailable: number;
            bundleSize: number;
        }
    }];
}