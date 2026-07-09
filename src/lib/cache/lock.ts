import { redisClient } from "./redis.js";

/**
 * Acquire a Redis lock for the given key.
 * Returns true if lock was acquired, false if already locked.
 * Lock auto-expires after ttlSeconds to prevent deadlocks.
 */
export const acquireLock = async (key: string, ttlSeconds = 30): Promise<boolean> => {
  const result = await redisClient.set(`lock:${key}`, "1", { NX: true, EX: ttlSeconds });
  return result === "OK";
};

export const releaseLock = async (key: string): Promise<void> => {
  await redisClient.del(`lock:${key}`);
};
