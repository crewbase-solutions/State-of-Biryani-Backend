import { isValidObjectId } from "mongoose";
import { IAddress, Address } from "./address.model.js";
import { AppError } from "../../core/errors/AppError.js";
import { cache } from "../../lib/cache/cache.js";

const addrKey = (userId: string, page: number, limit: number) => `addr:${userId}:${page}:${limit}`;

const validateId = (id: string) => {
  if (!isValidObjectId(id)) throw new AppError("Invalid address ID", 400);
};

class AddressService {
  async addAddress(userId: string, data: Partial<IAddress>) {
    const [addressCount, typeExists] = await Promise.all([
      Address.countDocuments({ userId, isActive: true }),
      Address.exists({ userId, type: data.type, isActive: true }),
    ]);

    if (typeExists) throw new AppError(`You already have a ${data.type} address. Update or delete it first.`, 409);

    if (addressCount === 0) data.isDefault = true;

    const address = await Address.create({ ...data, userId });
    await cache.delByPattern(`addr:${userId}:*`);
    return address;
  }

  async getMyAddresses(userId: string, page = 1, limit = 10) {
    const key = addrKey(userId, page, limit);
    const cached = await cache.get(key);
    if (cached) return cached;

    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      Address.find({ userId, isActive: true }).sort({ isDefault: -1, createdAt: -1 }).skip(skip).limit(limit),
      Address.countDocuments({ userId, isActive: true }),
    ]);
    const result = { data, pagination: { total, page, limit, pages: Math.ceil(total / limit) } };
    await cache.set(key, result, 60);
    return result;
  }

  async getAddressById(userId: string, addressId: string) {
    validateId(addressId);
    const address = await Address.findOne({ _id: addressId, userId, isActive: true });
    if (!address) throw new AppError("Address not found", 404);
    return address;
  }

  async updateAddress(userId: string, addressId: string, data: Partial<IAddress>) {
    validateId(addressId);
    const address = await Address.findOneAndUpdate(
      { _id: addressId, userId, isActive: true },
      { $set: data },
      { new: true, runValidators: true }
    );
    if (!address) throw new AppError("Address not found", 404);
    await cache.delByPattern(`addr:${userId}:*`);
    return address;
  }

  async setDefaultAddress(userId: string, addressId: string) {
    validateId(addressId);
    await Address.updateMany({ userId }, { $set: { isDefault: false } });

    const address = await Address.findOneAndUpdate(
      { _id: addressId, userId, isActive: true },
      { $set: { isDefault: true } },
      { new: true }
    );
    if (!address) throw new AppError("Address not found", 404);
    await cache.delByPattern(`addr:${userId}:*`);
    return address;
  }

  async deleteAddress(userId: string, addressId: string) {
    validateId(addressId);
    const address = await Address.findOneAndUpdate(
      { _id: addressId, userId, isActive: true },
      { $set: { isActive: false } },
      { new: true }
    );
    if (!address) throw new AppError("Address not found", 404);

    const wasDefault = address.isDefault;
    if (wasDefault) {
      await Address.findOneAndUpdate(
        { userId, isActive: true },
        { $set: { isDefault: true } },
        { sort: { createdAt: -1 } }
      );
    }
    await cache.delByPattern(`addr:${userId}:*`);
  }
}

export const addressService = new AddressService();
