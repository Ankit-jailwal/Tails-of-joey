export interface CreateManagerInput{
    name: string;
    ownerName: string;
    productType: [string];
    pincode: string;
    address: string;
    phone: string;
    email: string;
    password: string;
}

export interface ManagerLoginInput {
    email: string;
    password: string;
}

export interface ManagerPayload {
    _id: string;
    email: string;
    name: string;
}