import { Document, Schema, model } from "mongoose";

export type AddressType = "HOME" | "WORK" | "OTHER";

export interface IAddress extends Document {
  userId: string;
  type: AddressType;
  receiverName: string;
  receiverPhone: string;
  houseNo: string;
  floor?: string;
  landmark?: string;
  street: string;
  area: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  location: {
    type: "Point";
    coordinates: [number, number];
  };
  formattedAddress: string;
  deliveryInstructions?: string;
  isDefault: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const addressSchema = new Schema<IAddress>(
  {
    userId: { type: String, required: true, index: true },
    type: { type: String, enum: ["HOME", "WORK", "OTHER"], default: "HOME" },
    receiverName: { type: String, required: true, trim: true },
    receiverPhone: { type: String, required: true, trim: true },
    houseNo: { type: String, required: true, trim: true },
    floor: { type: String, default: null },
    landmark: { type: String, default: null },
    street: { type: String, required: true, trim: true },
    area: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    country: { type: String, default: "India" },
    pincode: { type: String, required: true, trim: true },
    location: {
    type: {
        type: String,
        enum: ["Point"],
        default: "Point"
    },
    coordinates: [Number]
},
    formattedAddress: { type: String, required: true },
    deliveryInstructions: { type: String, default: null },
    isDefault: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true, versionKey: false }
);

addressSchema.index({ pincode: 1 });
addressSchema.index({ "location.coordinates": "2dsphere" });

export const Address = model<IAddress>("Address", addressSchema);
