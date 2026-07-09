import "dotenv/config";
import mongoose from "mongoose";
import { prisma } from "./src/lib/database/prisma.js";
import { Admin } from "./src/modules/admin/admin.model.js";
import { env } from "./src/lib/env.js";

const ADMIN_PHONE = "+919277446167";
const ADMIN_NAME = "Admin";

async function seed() {
  await mongoose.connect(env.MONGO_URI);

  let userId: string;

  const existing = await prisma.user.findUnique({ where: { phoneNumber: ADMIN_PHONE } });

  if (existing) {
    await prisma.user.update({ where: { phoneNumber: ADMIN_PHONE }, data: { role: "ADMIN", name: ADMIN_NAME } });
    userId = existing.id;
    console.log("✅ Existing user updated to ADMIN:", ADMIN_PHONE);
  } else {
    userId = crypto.randomUUID();
    await prisma.user.create({
      data: {
        id: userId,
        name: ADMIN_NAME,
        email: `${ADMIN_PHONE}@stateofbiryani.app`,
        phoneNumber: ADMIN_PHONE,
        phoneNumberVerified: true,
        role: "ADMIN",
      },
    });
    console.log("✅ Admin user created:", ADMIN_PHONE);
  }

  await Admin.findOneAndUpdate(
    { userId },
    { userId, phone: ADMIN_PHONE, name: ADMIN_NAME },
    { upsert: true, new: true }
  );
  console.log("✅ Admin MongoDB profile upserted");

  await prisma.$disconnect();
  await mongoose.disconnect();
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
