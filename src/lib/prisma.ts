import { PrismaClient } from "@prisma/client";

/**
 * Global object to store the PrismaClient instance.
 *
 * This is used to prevent multiple instances of PrismaClient in development mode,
 * which can cause issues with database connections.
 */
const globalForPrisma = global as unknown as { prisma: PrismaClient };

/**
 * PrismaClient instance.
 *
 * This instance is either retrieved from the global object (in development mode)
 * or created anew (in production mode).
 *
 * @type {PrismaClient}
 */
export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ["query", "info", "warn", "error"], // Optional, for debugging
  });

/**
 * In development mode, store the PrismaClient instance in the global object.
 * This prevents multiple instances of PrismaClient from being created.
 */
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
