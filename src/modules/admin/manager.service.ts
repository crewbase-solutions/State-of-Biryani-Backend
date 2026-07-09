import { Manager, IManager } from "./manager.model.js";
import { AppError } from "../../core/errors/AppError.js";
import { AuthUser } from "../auth/auth.types.js";

class ManagerService {
  async getProfile(user: AuthUser) {
    const profile = await Manager.findOne({ userId: user.id });
    if (!profile) throw new AppError("Profile not found", 404);
    return profile;
  }

  async completeProfile(user: AuthUser, body: Partial<IManager>) {
    const profile = await Manager.findOneAndUpdate(
      { userId: user.id },
      { $set: { name: body.name, email: body.email, gender: body.gender } },
      { new: true, runValidators: true }
    );
    if (!profile) throw new AppError("Profile not found", 404);
    return profile;
  }

  async updateProfile(user: AuthUser, body: Partial<IManager>) {
    const profile = await Manager.findOneAndUpdate(
      { userId: user.id },
      {
        $set: {
          name: body.name,
          email: body.email,
          gender: body.gender,
        },
      },
      { new: true, runValidators: true }
    );
    if (!profile) throw new AppError("Profile not found", 404);
    return profile;
  }
}

export const managerService = new ManagerService();
