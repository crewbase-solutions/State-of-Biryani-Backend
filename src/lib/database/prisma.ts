import { PrismaClient } from "../../generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
import { env } from "../env.js";

const adapter = new PrismaPg({ connectionString: env.DATABASE_URL });

export const prisma = new PrismaClient({ adapter });

export const connectPostgres = async () => {
  try {
    await prisma.$connect();
    console.log("🐘 PostgreSQL Connected");
  } catch (error) {
    console.error("PostgreSQL Connection Failed", error);
    process.exit(1);
  }
};
