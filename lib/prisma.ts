import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL;
  
  if (!connectionString) {
    console.warn('DATABASE_URL not found, creating client without adapter');
    return new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    });
  }

  // Check if we're using Neon
  if (connectionString.includes('neon.tech')) {
    try {
      const { neonConfig, Pool } = require('@neondatabase/serverless');
      const { PrismaNeon } = require('@prisma/adapter-neon');
      const ws = require('ws');

      // Configure Neon for serverless environments
      neonConfig.webSocketConstructor = ws;

      // Create Neon connection pool
      const pool = new Pool({ connectionString });
      const adapter = new PrismaNeon(pool);

      return new PrismaClient({ 
        adapter,
        log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
      });
    } catch (error) {
      console.warn('Failed to create Neon adapter, falling back to default client:', error);
      return new PrismaClient({
        log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
      });
    }
  }

  // Default Prisma client for other databases
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

// Graceful shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});