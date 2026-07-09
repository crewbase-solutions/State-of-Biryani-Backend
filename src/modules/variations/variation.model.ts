import { Document, Schema, Types, model } from "mongoose";

export interface IVariation extends Document {
  menuItem: Types.ObjectId;
  name: string;
  price: number;
  isAvailable: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const variationSchema = new Schema<IVariation>(
  {
    menuItem: { type: Schema.Types.ObjectId, ref: "MenuItem", required: true },
    name: { type: String, required: true, trim: true, maxlength: 50 },
    price: { type: Number, required: true, min: 0 },
    isAvailable: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true, versionKey: false }
);

variationSchema.index({ menuItem: 1 });

export const Variation = model<IVariation>("Variation", variationSchema);
