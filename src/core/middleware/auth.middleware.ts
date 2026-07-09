import { Request, Response, NextFunction } from "express";
import { prisma } from "../../lib/database/prisma.js";
import { AppError } from "../errors/AppError.js";
import { AuthRequest } from "../../modules/auth/auth.types.js";
import { cache } from "../../lib/cache/cache.js";

type UserRole = "CUSTOMER" | "DELIVERY" | "MANAGER" | "ADMIN";

export const requireAuth = (...roles: UserRole[]) => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization?.startsWith("Bearer ")
        ? req.headers.authorization.slice(7)
        : null;

      if (!token) throw new AppError("Unauthorized", 401);

      const sessionKey = `session:${token}`;
      let session = await cache.get<{ expiresAt: string; user: any } & Record<string, any>>(sessionKey);

      if (!session) {
        session = await prisma.session.findUnique({ where: { token }, include: { user: true } }) as any;
        if (session) await cache.set(sessionKey, session, 60);
      }

      if (!session) throw new AppError("Unauthorized", 401);

      if (new Date(session.expiresAt) < new Date()) {
        await prisma.session.delete({ where: { token } });
        await cache.del(sessionKey);
        throw new AppError("Session expired, please login again", 401);
      }

      if (!session.user) {
        await prisma.session.delete({ where: { token } });
        await cache.del(sessionKey);
        throw new AppError("Unauthorized", 401);
      }

      if (roles.length > 0 && !roles.includes(session.user.role as UserRole)) {
        throw new AppError("Forbidden", 403);
      }

      (req as AuthRequest).user = session.user;
      next();
    } catch (error) {
      next(error);
    }
  };
};
