import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import { errorHandler } from "./core/middleware/errorHandler.js";
import authRoutes from "./modules/auth/auth.routes.js";
import customerRoutes from "./modules/customer/customer.routes.js";
import addressRoutes from "./modules/address/address.routes.js";
import categoryRoutes from "./modules/category/category.routes.js";
import menuItemRoutes from "./modules/menuItem/menuItem.routes.js";
import variationRoutes from "./modules/variations/variation.routes.js";
import managerRoutes from "./modules/admin/manager.routes.js";
import deliveryRoutes from "./modules/delivery/delivery.routes.js";
import adminRoutes from "./modules/admin/admin.routes.js";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth/auth.js";

const app = express();

app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Better Auth MUST come before other routes
app.all("/api/auth/*splat", toNodeHandler(auth));
app.use("/api/login", authRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/address", addressRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/menu-items", menuItemRoutes);
app.use("/api/variations", variationRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/manager", managerRoutes);
app.use("/api/delivery", deliveryRoutes);

// Error handling middleware
app.use(errorHandler);
export default app;
