import { hashPassword } from "@/app/lib/auth";
// import { prisma } from "@/app/lib/db";
import { Role } from "@/app/types";
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



async function  main(){
  console.log("Starting database seed..")
  //create team 
  const teams = await Promise.all([
    prisma.team.create({
        data: {
            name: "Engineering",
            description : "Software development teams",
            code: "ENG-2026"
        },
    }),
    prisma.team.create({
        data: {
            name: "Marketing",
            description : "Marketing and sales teams",
            code: "MKT-2026"
        },
    }),
    prisma.team.create({
        data: {
            name: "Operations",
            description : "Business operations team",
            code: "OPS-2026"
        },
    }),
    prisma.team.create({
        data: {
            name: "HR",
            description : "Hiring and management",
            code: "HR-2026"
        },
    })
  ])

  //Create sample user 
  const sampleUsers = [
    {
        name:"John Developer",
        email :"john@company.com",
        team: teams[0],
        role: Role.MANAGER
    },
    {
        name:"Jane Designer",
        email :"jane@company.com",
        team: teams[0],
        role: Role.USER
    },
    {
        name:"Bob marketer",
        email :"bob@company.com",
        team: teams[1],
        role: Role.MANAGER
    },
    {
        name:"Alice Sales",
        email :"alice@company.com",
        team: teams[1],
        role: Role.USER
    }
  ]

  for (const userData of sampleUsers){
    await prisma.user.create({
        data:{
            email: userData.email,
            name: userData.name,
            password: await hashPassword('123456'),
            role: userData.role,
            teamId: userData.team.id
        },
    })
  }
  console.log('✅ Database seeded successfully!')
}

main().catch((error)=>{
  console.log('❌ seeding failed :',error)
  process.exit(1)
}).finally(async ()=>{
   await prisma.$disconnect();
})