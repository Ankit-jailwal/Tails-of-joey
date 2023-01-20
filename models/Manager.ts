import mongoose, { Schema, Model, Document } from "mongoose";

interface ManagerDoc extends Document {
  name: string;
  ownerName: string;
  productType: [string];
  pincode: string;
  address: string;
  phone: string;
  email: string;
  password: string;
  salt: string;
  serviceAvailable: string;
  coverImages: [string];
  rating: number;
//   products: any;
}

const ManagerSchema = new Schema(
  {
    name: { type: String, required: true },
    ownerName: { type: String, required: true },
    productType: { type: [String] },
    pincode: { type: String, required: true },
    address: { type: String },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    salt: { type: String, required: true },
    serviceAvailable: { type: Boolean },
    coverImages: { type: [String] },
    rating: { type: Number },
    // products: [
    //   {
    //     type: mongoose.SchemaTypes.ObjectId,
    //     ref: "product",
    //   },
    // ],
  },
  {
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

const Manager = mongoose.model<ManagerDoc>("manager", ManagerSchema);

export { Manager };
