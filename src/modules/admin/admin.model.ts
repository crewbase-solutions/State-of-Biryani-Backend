import { Document, Schema, model } from "mongoose";

export interface IAdmin extends Document {
  userId: string;
  phone: string;
  name: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const adminSchema = new Schema<IAdmin>(
  {
    userId: { type: String, required: true, unique: true, index: true },
    phone: { type: String, required: true, unique: true },
    name: { type: String, required: true, trim: true, maxlength: 100 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true, versionKey: false }
);

export const Admin = model<IAdmin>("Admin", adminSchema);
