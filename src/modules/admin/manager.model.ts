import { Document, Schema, model } from "mongoose";

export interface IManager extends Document {
  userId: string;
  phone: string;
  name: string;
  email?: string;
  gender?: "MALE" | "FEMALE" | "OTHER";
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const managerSchema = new Schema<IManager>(
  {
    userId: { type: String, required: true, unique: true, index: true },
    phone: { type: String, required: true, unique: true },
    name: { type: String, required: true, trim: true, maxlength: 100 },
    email: { type: String, trim: true, lowercase: true, default: null },
    gender: { type: String, enum: ["MALE", "FEMALE", "OTHER"], default: null },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true, versionKey: false }
);

export const Manager = model<IManager>("Manager", managerSchema);
