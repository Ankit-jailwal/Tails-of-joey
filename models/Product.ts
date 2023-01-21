import mongoose, { Schema, Document } from 'mongoose';

interface ProductDoc extends Document {
    name: string;
    description: string;
    category: string;
    productType: [string];
    mrp: number;
    price: number;
    rating: number;
    images: [string]
}

const ProductSchema = new Schema({

    name: {type : String, required: true},
    description: {type : String, required: true},
    category: {type : String},
    productType: {type : [String], required: true},
    mrp: {type : Number, required: true},
    price: {type : Number},
    rating: {type : Number},
    images: {type : [String]}

}, {
    toJSON: {
        transform(doc, ret) {
            delete ret._v,
            delete ret.createdAt,
            delete ret.updatedAt
        },
        timestamps: true
    }
})

const Product = mongoose.model<ProductDoc>('product', ProductSchema)

export { Product }