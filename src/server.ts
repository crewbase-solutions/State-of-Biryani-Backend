import cluster from "cluster";
import os from "os";
import app from "./app.js";
import { env } from "./lib/env.js";
import { connectDB } from "./lib/database/mongodb.js";
import { connectRedis } from "./lib/cache/redis.js";
import { connectPostgres } from "./lib/database/prisma.js";

const startServer = async () => {
  try {
    await connectDB();
    await connectRedis();
    await connectPostgres();

    app.listen(env.PORT, () => {
      console.log(`🚀 Server running at http://localhost:${env.PORT} [worker ${process.pid}]`);
    });
  } catch (error) {
    console.error("Failed to start server", error);
    process.exit(1);
  }
};

if (cluster.isPrimary && env.NODE_ENV === "production") {
  const cpus = os.cpus().length;
  console.log(`Primary ${process.pid} started — forking ${cpus} workers`);

  for (let i = 0; i < cpus; i++) cluster.fork();

  cluster.on("exit", (worker, code, signal) => {
    console.warn(`Worker ${worker.process.pid} died (${signal ?? code}) — restarting`);
    cluster.fork();
  });
} else {
  startServer();
}
