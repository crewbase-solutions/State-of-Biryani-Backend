import { Document, Schema, model } from "mongoose";

export type Gender = "MALE" | "FEMALE" | "OTHER";

export interface ICustomer extends Document {
  userId: string;
  phone: string;
  name: string;
  email?: string;
  gender?: Gender;
  dob?: Date;
  isDeleted: boolean;
  deletedAt?: Date | null;
  lastActiveAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const customerSchema = new Schema<ICustomer>(
  {
    userId: { type: String, required: true, unique: true, index: true, trim: true },
    phone: { type: String, required: true, trim: true, unique: true },
    name: { type: String, required: true, trim: true, maxlength: 100 },
    email: { type: String, trim: true, lowercase: true, default: null },
    gender: { type: String, enum: ["MALE", "FEMALE", "OTHER"], default: null },
    dob: { type: Date, default: null },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
    lastActiveAt: { type: Date, default: Date.now },
  },
  { timestamps: true, versionKey: false }
);

customerSchema.index({ email: 1 });
customerSchema.index({ isDeleted: 1 });

export const Customer = model<ICustomer>("Customer", customerSchema);
