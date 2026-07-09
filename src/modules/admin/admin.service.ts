import { prisma } from "../../lib/database/prisma.js";
import { AppError } from "../../core/errors/AppError.js";
import { Admin } from "./admin.model.js";
import { Manager } from "./manager.model.js";
import { Delivery } from "../delivery/delivery.model.js";

type CreatableRole = "MANAGER" | "DELIVERY" | "ADMIN";

class AdminService {
  async createUser(phone: string, name: string, role: CreatableRole) {
    const existing = await prisma.user.findUnique({ where: { phoneNumber: phone } });

    let userId: string;

    if (existing) {
      if (existing.role !== "CUSTOMER") {
        throw new AppError(`This number is already registered as ${existing.role.toLowerCase()}`, 409);
      }
      // Customer is now a staff member — update their role
      await prisma.user.update({ where: { id: existing.id }, data: { role, name } });
      userId = existing.id;
    } else {
      userId = crypto.randomUUID();
      await prisma.user.create({
        data: {
          id: userId,
          name,
          email: `${phone}@stateofbiryani.app`,
          phoneNumber: phone,
          phoneNumberVerified: true,
          role,
        },
      });
    }

    if (role === "ADMIN") {
      await Admin.findOneAndUpdate({ userId }, { userId, phone, name }, { upsert: true });
    } else if (role === "MANAGER") {
      await Manager.findOneAndUpdate({ userId }, { userId, phone, name }, { upsert: true });
    } else if (role === "DELIVERY") {
      await Delivery.findOneAndUpdate({ userId }, { userId, phone, name }, { upsert: true });
    }

    return await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, phoneNumber: true, role: true, createdAt: true },
    });
  }

  async getUsers(role?: CreatableRole) {
    return await prisma.user.findMany({
      where: { role: role ?? { in: ["ADMIN", "MANAGER", "DELIVERY"] } },
      select: { id: true, name: true, phoneNumber: true, role: true, createdAt: true },
      orderBy: { createdAt: "desc" },
    });
  }

  async deleteUser(id: string) {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) throw new AppError("User not found", 404);
    if (user.role === "CUSTOMER") throw new AppError("Cannot delete customer accounts from here", 400);

    await Promise.all([
      prisma.session.deleteMany({ where: { userId: id } }),
      prisma.user.delete({ where: { id } }),
      user.role === "ADMIN" ? Admin.deleteOne({ userId: id }) : null,
      user.role === "MANAGER" ? Manager.deleteOne({ userId: id }) : null,
      user.role === "DELIVERY" ? Delivery.deleteOne({ userId: id }) : null,
    ]);
  }
}

export const adminService = new AdminService();
