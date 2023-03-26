import mongoose, { Schema, Document } from 'mongoose';

export interface OrderDoc extends Document {
    orderID: string,
    items: [any],
    totalAmount: number,
    orderDate: Date,
    paidThrough: string,
    paymentStatus: string,
    orderStatus: string,
    remarks: string,
    deliveryId: string,
    appliedOffers: boolean,
    offerId: string,
    readyTime: number
}

const OrderSchema = new Schema({
    orderID: {type: String, required: true},
    items: [
        {
            product: {type: Schema.Types.ObjectId, ref:"product", required: true},
            unit: {type: Number, required: true}
        }
    ],
    totalAmount: {type: Number, required: true},
    orderDate: {type: Date},
    paidThrough: {type: String },
    paymentStatus: {type: String },
    orderStatus: {type: String },
    remarks: {type: String},
    readyTime: {type: Number}
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

const Order = mongoose.model<OrderDoc>('order', OrderSchema)

export { Order }