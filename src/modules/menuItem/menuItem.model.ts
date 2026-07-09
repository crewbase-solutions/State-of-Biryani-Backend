import { Document, Schema, Types, model } from "mongoose";

export interface IMenuItem extends Document {
  name: string;
  slug: string;
  description?: string;
  images: string[];
  category: Types.ObjectId;
  isVeg: boolean;
  isAvailable: boolean;
  sortOrder: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const menuItemSchema = new Schema<IMenuItem>(
  {
    name: { type: String, required: true, trim: true, unique: true, maxlength: 100 },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String, default: "", trim: true },
    images: [{ type: String }],
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    isVeg: { type: Boolean, required: true },
    isAvailable: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true, versionKey: false }
);

menuItemSchema.index({ category: 1, isActive: 1, isAvailable: 1 });
menuItemSchema.index({ sortOrder: 1 });

export const MenuItem = model<IMenuItem>("MenuItem", menuItemSchema);
