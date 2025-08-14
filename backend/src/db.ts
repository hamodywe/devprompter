import { PrismaClient } from '@prisma/client';

// Initialize Prisma client
export const prisma = new PrismaClient();

// Graceful shutdown helper
export const disconnectPrisma = async () => {
  await prisma.$disconnect();
};