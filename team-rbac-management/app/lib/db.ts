import { PrismaClient } from "@prisma/client/extension";

export const prisma= new PrismaClient();

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