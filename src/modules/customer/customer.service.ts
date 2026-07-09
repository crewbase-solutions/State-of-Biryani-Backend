import { ICustomer, Customer } from "./customer.model.js";
import { Address } from "../address/address.model.js";
import { AppError } from "../../core/errors/AppError.js";
import { AuthUser } from "../auth/auth.types.js";
import { prisma } from "../../lib/database/prisma.js";

class CustomerService {
  async createFromAuth(userId: string, phone: string) {
    const existing = await Customer.findOne({ userId });
    if (existing) return existing;

    return await Customer.create({
      userId,
      phone,
      name: phone,
    });
  }

  async completeProfile(user: AuthUser, body: Partial<ICustomer>) {
    const customer = await Customer.findOneAndUpdate(
      { userId: user.id },
      {
        $set: {
          name: body.name,
          email: body.email,
          gender: body.gender,
          dob: body.dob,
        },
      },
      { new: true, runValidators: true }
    );
    if (!customer) throw new AppError("Customer not found", 404);
    return customer;
  }

  async getMyProfile(user: AuthUser) {
    const customer = await Customer.findOne({ userId: user.id, isDeleted: false });
    if (!customer) throw new AppError("Customer not found", 404);

    const addresses = await Address.find({ userId: user.id, isActive: true }).sort({ isDefault: -1, createdAt: -1 });

    return {
      id: customer._id,
      userId: customer.userId,
      name: customer.name,
      phone: customer.phone,
      email: customer.email,
      gender: customer.gender,
      dob: customer.dob,
      createdAt: customer.createdAt,
      updatedAt: customer.updatedAt,
      addresses,
    };
  }

  async updateProfile(user: AuthUser, body: Partial<ICustomer>) {
    const customer = await Customer.findOneAndUpdate(
      { userId: user.id, isDeleted: false },
      {
        $set: {
          name: body.name,
          email: body.email,
          gender: body.gender,
          dob: body.dob,
          lastActiveAt: new Date(),
        },
      },
      { new: true, runValidators: true }
    );
    if (!customer) throw new AppError("Customer not found", 404);
    return customer;
  }

  async deleteAccount(user: AuthUser) {
    const customer = await Customer.findOneAndUpdate(
      { userId: user.id },
      { $set: { isDeleted: true, deletedAt: new Date() } }
    );
    if (!customer) throw new AppError("Customer not found", 404);
    await prisma.session.deleteMany({ where: { userId: user.id } });
  }
}

export const customerService = new CustomerService();
