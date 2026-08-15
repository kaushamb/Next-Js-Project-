import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

const connectionString = process.env.DATABASE_URL;

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma= globalForPrisma.prisma ||
  new PrismaClient({
    adapter,
    log: ['query'],
  });

//database helper function
export async function checkDataBaseConnection(): Promise<boolean> {
 try{
   await prisma.$queryRaw`Select 1`;
   return true;
 }catch(err){
    console.log("Database connection failed!")
    return false;
 }
}