import { Request } from "express";

export type UserRole = "CUSTOMER" | "ADMIN" | "MANAGER" | "DELIVERY";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  phoneNumberVerified?: boolean;
  emailVerified: boolean;
  image?: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthRequest extends Request {
  user: AuthUser;
}

export interface SendOtpBody {
  phoneNumber: string;
}

export interface VerifyOtpBody {
  phoneNumber: string;
  code: string;
}
