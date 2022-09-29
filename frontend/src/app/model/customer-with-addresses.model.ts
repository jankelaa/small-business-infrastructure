export class CustomerWithAddresses {
  id: number;
  name: string;
  pib: number;
  rank: number;
  // phone: string;
  addresses: [{
    id: number;
    address: string;
    city: string;
    country: string;
    zipCode: string;
    isMain: boolean;    
  }];
}