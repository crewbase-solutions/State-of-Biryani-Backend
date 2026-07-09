import { Delivery, IDelivery } from "./delivery.model.js";
import { AppError } from "../../core/errors/AppError.js";
import { AuthUser } from "../auth/auth.types.js";

class DeliveryService {
  async getProfile(user: AuthUser) {
    const profile = await Delivery.findOne({ userId: user.id });
    if (!profile) throw new AppError("Profile not found", 404);
    return profile;
  }

  async completeProfile(user: AuthUser, body: Partial<IDelivery>) {
    const profile = await Delivery.findOneAndUpdate(
      { userId: user.id },
      {
        $set: {
          name: body.name,
          email: body.email,
          gender: body.gender,
          dob: body.dob,
          vehicleType: body.vehicleType,
          vehicleNumber: body.vehicleNumber,
        },
      },
      { new: true, runValidators: true }
    );
    if (!profile) throw new AppError("Profile not found", 404);
    return profile;
  }

  async updateProfile(user: AuthUser, body: Partial<IDelivery>) {
    const profile = await Delivery.findOneAndUpdate(
      { userId: user.id },
      {
        $set: {
          name: body.name,
          email: body.email,
          gender: body.gender,
          dob: body.dob,
          vehicleType: body.vehicleType,
          vehicleNumber: body.vehicleNumber,
        },
      },
      { new: true, runValidators: true }
    );
    if (!profile) throw new AppError("Profile not found", 404);
    return profile;
  }

  async updateLocation(user: AuthUser, lat: number, lng: number) {
    const profile = await Delivery.findOneAndUpdate(
      { userId: user.id },
      { $set: { currentLocation: { lat, lng } } },
      { new: true }
    );
    if (!profile) throw new AppError("Profile not found", 404);
    return profile;
  }

  async toggleAvailability(user: AuthUser) {
    const profile = await Delivery.findOne({ userId: user.id });
    if (!profile) throw new AppError("Profile not found", 404);
    profile.isAvailable = !profile.isAvailable;
    await profile.save();
    return profile;
  }
}

export const deliveryService = new DeliveryService();
