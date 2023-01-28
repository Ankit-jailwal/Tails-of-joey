import mongoose, { Schema, Model, Document } from "mongoose";

interface ManagerDoc extends Document {
  name: string;
  phone: string;
  email: string;
  password: string;
  salt: string;
}

const ManagerSchema = new Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    salt: { type: String, required: true },
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
