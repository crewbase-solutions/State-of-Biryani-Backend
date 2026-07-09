import { z } from "zod";

const phone = z.string().regex(/^\+[1-9]\d{7,14}$/, "Invalid phone number format");
const otp = z.string().regex(/^\d{6}$/, "OTP must be 6 digits");
const gender = z.enum(["MALE", "FEMALE", "OTHER"]);
const mongoId = z.string().regex(/^[a-f\d]{24}$/i, "Invalid ID");

// ─── Auth ────────────────────────────────────────────────────────────────────
export const sendOtpSchema = z.object({ phoneNumber: phone });
export const verifyOtpSchema = z.object({ phoneNumber: phone, code: otp });
export const refreshSchema = z.object({ token: z.string().min(1) });

// ─── Customer ────────────────────────────────────────────────────────────────
const customerProfileFields = z.object({
  name: z.string().min(1).max(100).optional(),
  email: z.string().email().optional(),
  gender: gender.optional(),
  dob: z.string().date().optional(),
});
export const completeCustomerProfileSchema = customerProfileFields;
export const updateCustomerProfileSchema = customerProfileFields;

// ─── Address ─────────────────────────────────────────────────────────────────
export const addAddressSchema = z.object({
  type: z.enum(["HOME", "WORK", "OTHER"]).optional(),
  receiverName: z.string().min(1),
  receiverPhone: phone,
  houseNo: z.string().min(1),
  floor: z.string().optional(),
  landmark: z.string().optional(),
  street: z.string().min(1),
  area: z.string().min(1),
  city: z.string().min(1),
  state: z.string().min(1),
  country: z.string().optional(),
  pincode: z.string().regex(/^\d{6}$/, "Invalid pincode"),
  location: z
    .object({
      coordinates: z.tuple([z.number(), z.number()]),
    })
    .optional(),
  formattedAddress: z.string().min(1),
  deliveryInstructions: z.string().optional(),
});
export const updateAddressSchema = addAddressSchema.partial();

// ─── Category ────────────────────────────────────────────────────────────────
export const createCategorySchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().optional(),
  image: z.string().url().optional(),
  sortOrder: z.number().int().min(0).optional(),
});
export const updateCategorySchema = createCategorySchema.partial().extend({
  isActive: z.boolean().optional(),
});

// ─── MenuItem ────────────────────────────────────────────────────────────────
export const createMenuItemSchema = z.object({
  name: z.string().min(1).max(150),
  description: z.string().optional(),
  images: z.array(z.string().url()).optional(),
  category: mongoId,
  isVeg: z.boolean(),
  sortOrder: z.number().int().min(0).optional(),
  variations: z
    .array(
      z.object({
        name: z.string().min(1),
        price: z.number().positive(),
        sortOrder: z.number().int().min(0).optional(),
      })
    )
    .min(1, "At least one variation is required"),
});
export const updateMenuItemSchema = z.object({
  name: z.string().min(1).max(150).optional(),
  description: z.string().optional(),
  images: z.array(z.string().url()).optional(),
  category: mongoId.optional(),
  isVeg: z.boolean().optional(),
  isAvailable: z.boolean().optional(),
  sortOrder: z.number().int().min(0).optional(),
  isActive: z.boolean().optional(),
});

// ─── Variation ───────────────────────────────────────────────────────────────
export const addVariationSchema = z.object({
  name: z.string().min(1),
  price: z.number().positive(),
  sortOrder: z.number().int().min(0).optional(),
});
export const updateVariationSchema = z.object({
  name: z.string().min(1).optional(),
  price: z.number().positive().optional(),
  isAvailable: z.boolean().optional(),
  sortOrder: z.number().int().min(0).optional(),
});

// ─── Admin ───────────────────────────────────────────────────────────────────
export const createUserSchema = z.object({
  phone: phone,
  name: z.string().min(1).max(100),
});

// ─── Manager ─────────────────────────────────────────────────────────────────
const managerProfileFields = z.object({
  name: z.string().min(1).max(100).optional(),
  email: z.string().email().optional(),
  gender: gender.optional(),
});
export const completeManagerProfileSchema = managerProfileFields;
export const updateManagerProfileSchema = managerProfileFields;

// ─── Delivery ────────────────────────────────────────────────────────────────
const deliveryProfileFields = z.object({
  name: z.string().min(1).max(100).optional(),
  email: z.string().email().optional(),
  gender: gender.optional(),
  dob: z.string().date().optional(),
  vehicleType: z.enum(["BIKE", "SCOOTER", "BICYCLE", "OTHER"]).optional(),
  vehicleNumber: z.string().optional(),
});
export const completeDeliveryProfileSchema = deliveryProfileFields;
export const updateDeliveryProfileSchema = deliveryProfileFields;
export const updateLocationSchema = z.object({
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
});
