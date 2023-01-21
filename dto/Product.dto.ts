export interface CreateProductInput {
    name: string;
    description: string;
    category: string;
    productType: [string];
    mrp: string;
    price: string;
    images: [string]
}