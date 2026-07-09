import { Document, Schema, Types, model } from "mongoose";

export interface IAddon extends Document {
  menuItem: Types.ObjectId;
  name: string;
  price: number;
  isAvailable: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const addonSchema = new Schema<IAddon>(
  {
    menuItem: { type: Schema.Types.ObjectId, ref: "MenuItem", required: true },
    name: { type: String, required: true, trim: true, maxlength: 50 },
    price: { type: Number, required: true, min: 0 },
    isAvailable: { type: Boolean, default: true },
  },
  { timestamps: true, versionKey: false }
);

addonSchema.index({ menuItem: 1 });

export const Addon = model<IAddon>("Addon", addonSchema);
