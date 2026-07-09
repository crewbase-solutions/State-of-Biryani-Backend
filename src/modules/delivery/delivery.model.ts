import { Document, Schema, model } from "mongoose";

export interface IDelivery extends Document {
  userId: string;
  phone: string;
  name: string;
  email?: string;
  gender?: "MALE" | "FEMALE" | "OTHER";
  dob?: Date;
  vehicleType?: "BIKE" | "SCOOTER" | "BICYCLE" | "OTHER";
  vehicleNumber?: string;
  currentLocation?: { lat: number; lng: number };
  isAvailable: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const deliverySchema = new Schema<IDelivery>(
  {
    userId: { type: String, required: true, unique: true, index: true },
    phone: { type: String, required: true, unique: true },
    name: { type: String, required: true, trim: true, maxlength: 100 },
    email: { type: String, trim: true, lowercase: true, default: null },
    gender: { type: String, enum: ["MALE", "FEMALE", "OTHER"], default: null },
    dob: { type: Date, default: null },
    vehicleType: { type: String, enum: ["BIKE", "SCOOTER", "BICYCLE", "OTHER"], default: null },
    vehicleNumber: { type: String, trim: true, uppercase: true, default: null },
    currentLocation: {
      type: { lat: Number, lng: Number },
      default: null,
    },
    isAvailable: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true, versionKey: false }
);

export const Delivery = model<IDelivery>("Delivery", deliverySchema);
