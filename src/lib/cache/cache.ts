import { redisClient } from "../cache/redis.js";

interface MemEntry { value: unknown; expiresAt: number; }
const mem = new Map<string, MemEntry>();

const memGet = <T>(key: string): T | null => {
  const entry = mem.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) { mem.delete(key); return null; }
  return entry.value as T;
};

const memSet = (key: string, value: unknown, ttlSeconds: number) =>
  mem.set(key, { value, expiresAt: Date.now() + ttlSeconds * 1000 });

const memDel = (key: string) => mem.delete(key);

const memDelByPattern = (pattern: string) => {
  const regex = new RegExp("^" + pattern.replace(/\*/g, ".*") + "$");
  for (const key of mem.keys()) if (regex.test(key)) mem.delete(key);
};

export const cache = {
  async get<T>(key: string): Promise<T | null> {
    const hit = memGet<T>(key);
    if (hit !== null) return hit;
    const val = await redisClient.get(key);
    if (!val) return null;
    const parsed = JSON.parse(val) as T;
    memSet(key, parsed, 60);
    return parsed;
  },

  async set(key: string, value: unknown, ttlSeconds = 60): Promise<void> {
    memSet(key, value, ttlSeconds);
    await redisClient.set(key, JSON.stringify(value), { EX: ttlSeconds });
  },

  async del(...keys: string[]): Promise<void> {
    keys.forEach(memDel);
    if (keys.length) await redisClient.del(keys);
  },

  async delByPattern(pattern: string): Promise<void> {
    memDelByPattern(pattern);
    const keys = await redisClient.keys(pattern);
    if (keys.length) await redisClient.del(keys);
  },
};
