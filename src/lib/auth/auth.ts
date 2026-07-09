import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { phoneNumber } from "better-auth/plugins";
import twilio from "twilio";

import { prisma } from "../database/prisma.js";
import { env } from "../env.js";
import { customerService } from "../../modules/customer/customer.service.js";
import { Admin } from "../../modules/admin/admin.model.js";
import { Manager } from "../../modules/admin/manager.model.js";
import { Delivery } from "../../modules/delivery/delivery.model.js";

const twilioClient = twilio(env.TWILIO_ACCOUNT_SID, env.TWILIO_AUTH_TOKEN);

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  secret: env.BETTER_AUTH_SECRET,

  baseURL: env.BETTER_AUTH_URL,

  trustedOrigins: [
    "http://localhost:8081",
    "http://localhost:3000",
  ],

  advanced: {
    disableCSRFCheck: true,
  },

  emailAndPassword: {
    enabled: false,
  },

  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "CUSTOMER",
        input: false,
      },
    },
  },

  plugins: [
    phoneNumber({
      otpLength: 6,

      expiresIn: 300,

      async sendOTP({ phoneNumber, code }) {
        await twilioClient.messages.create({
          body: `Your State of Biryani OTP is ${code}. Valid for 5 minutes. Do not share with anyone.`,
          from: env.TWILIO_PHONE_NUMBER,
          to: phoneNumber,
        });
      },

      signUpOnVerification: {
        getTempEmail(phoneNumber) {
          return `${phoneNumber}@stateofbiryani.app`;
        },

        getTempName(phoneNumber) {
          return phoneNumber;
        },
      },

      async callbackOnVerification({ user }) {
        const role = (user as any).role;
        const phone = user.phoneNumber ?? "";

        if (role === "CUSTOMER") {
          await customerService.createFromAuth(user.id, phone);
        } else if (role === "ADMIN") {
          await Admin.findOneAndUpdate({ userId: user.id }, { userId: user.id, phone, name: user.name }, { upsert: true });
        } else if (role === "MANAGER") {
          await Manager.findOneAndUpdate({ userId: user.id }, { userId: user.id, phone, name: user.name }, { upsert: true });
        } else if (role === "DELIVERY") {
          await Delivery.findOneAndUpdate({ userId: user.id }, { userId: user.id, phone, name: user.name }, { upsert: true });
        }
      },
    }),
  ],
});
