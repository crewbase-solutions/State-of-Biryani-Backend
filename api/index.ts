import app from "../src/app.js";
import { connectDB } from "../src/lib/database/mongodb.js";
import { connectPostgres } from "../src/lib/database/prisma.js";

let isConnected = false;

const connect = async () => {
  if (isConnected) return;
  await connectDB();
  await connectPostgres();
  isConnected = true;
};

export default async function handler(req: any, res: any) {
  await connect();
  return app(req, res);
}
