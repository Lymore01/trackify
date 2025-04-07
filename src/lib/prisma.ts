import { PrismaClient } from "@prisma/client";
import { config } from "../../config/config.ts";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
  });

if (config.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;