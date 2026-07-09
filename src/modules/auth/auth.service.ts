import { prisma } from "../../lib/database/prisma.js";
import { env } from "../../lib/env.js";
import { AppError } from "../../core/errors/AppError.js";
import { cache } from "../../lib/cache/cache.js";
import { acquireLock, releaseLock } from "../../lib/cache/lock.js";

type AllowedRole = "CUSTOMER" | "ADMIN" | "MANAGER" | "DELIVERY";

class AuthService {
  async sendOtp(phoneNumber: string, expectedRole: AllowedRole) {
    if (!phoneNumber) throw new AppError("Phone number is required", 400);
    if (!/^\+[1-9]\d{7,14}$/.test(phoneNumber)) throw new AppError("Invalid phone number format", 400);

    const locked = await acquireLock(`otp:${phoneNumber}`, 30);
    if (!locked) throw new AppError("OTP already sent. Please wait before requesting again.", 429);

    try {
      if (expectedRole !== "CUSTOMER") {
        const user = await prisma.user.findUnique({ where: { phoneNumber } });
        if (!user) throw new AppError("No account found with this phone number", 404);
        if (user.role !== expectedRole) throw new AppError("Access denied for this app", 403);
      } else {
        const user = await prisma.user.findUnique({ where: { phoneNumber } });
        if (user && user.role !== "CUSTOMER") throw new AppError("Access denied for this app", 403);
      }

      const res = await fetch(`${env.BETTER_AUTH_URL}/api/auth/phone-number/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new AppError((data as any)?.message ?? "Failed to send OTP", res.status);
    } catch (error) {
      await releaseLock(`otp:${phoneNumber}`);
      throw error;
    }
  }

  async verifyOtp(phoneNumber: string, code: string, expectedRole: AllowedRole) {
    if (!/^\d{6}$/.test(code)) throw new AppError("Invalid OTP format", 400);
    if (!/^\+[1-9]\d{7,14}$/.test(phoneNumber)) throw new AppError("Invalid phone number format", 400);
    const res = await fetch(`${env.BETTER_AUTH_URL}/api/auth/phone-number/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phoneNumber, code }),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new AppError((data as any)?.message ?? "Invalid or expired OTP", res.status);

    const user = await prisma.user.findUnique({ where: { phoneNumber } });
    if (!user || user.role !== expectedRole) throw new AppError("Access denied for this app", 403);

    return { token: (data as any).token as string, user: (data as any).user };
  }

  async logout(token: string) {
    await prisma.session.deleteMany({ where: { token } });
    await cache.del(`session:${token}`);
  }

  async refreshSession(token: string) {
    const session = await prisma.session.findUnique({ where: { token }, include: { user: true } });
    if (!session || session.expiresAt < new Date()) throw new AppError("Session expired, please login again", 401);

    const newExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    await prisma.session.update({ where: { token }, data: { expiresAt: newExpiresAt } });

    return { token, expiresAt: newExpiresAt, user: session.user };
  }

  async getMe(token: string) {
    const session = await prisma.session.findUnique({ where: { token }, include: { user: true } });
    if (!session || session.expiresAt < new Date()) throw new AppError("Unauthorized", 401);
    return session.user;
  }
}

export const authService = new AuthService();
