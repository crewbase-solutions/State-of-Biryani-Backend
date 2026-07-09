import { createClient } from "redis";
import { env } from "../env.js";

export const redisClient = createClient({
  url: env.REDIS_URL,
});

redisClient.on("ready", () => {
});

redisClient.on("error", (_error) => {
});

redisClient.on("end", () => {
  console.log("Redis Connection Closed");
});

export const connectRedis = async (): Promise<void> => {
  try {
    await redisClient.connect();
  } catch (error) {
    console.error("Failed to connect Redis", error);
    process.exit(1);
  }
};