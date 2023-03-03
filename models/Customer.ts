import mongoose, { Schema, Model, Document } from "mongoose";
import { OrderDoc } from '../models'
interface CustomerDoc extends Document {
  firstName: string;
  lastName: String;
  phone: string;
  email: string;
  password: string;
  salt: string;
  address: string;
  verified: boolean;
  otp: number;
  otp_expiry: Date;
  lat: number;
  lng: number;
  orders: [OrderDoc]
}

const CustomerSchema = new Schema({
    firstName: {type: String},
    lastName: {type: String},
    phone: {type: String, required: true},
    email: {type: String, required: true},
    otp: {type: Number, required: true},
    salt: {type: String, required: true},
    verified: {type: Boolean, required: true},
    otp_expiry: {type: Date, required: true},
    password: {type: String},
    address: {type: String},
    lat: {type: Number},
    lng: {type: Number},
    orders: [
      {
        type: Schema.Types.ObjectId,
        ref: 'order'
      }
    ]
},   {
    toJSON: {
      transform(doc, ret) {
        delete ret.password;
        delete ret.salt;
        delete ret._v;
        delete ret.createdAt;
        delete ret.updatedAt;
      }
    },
    timestamps: true,
  }
);

const Customer = mongoose.model<CustomerDoc>("customer", CustomerSchema);

export { Customer };
