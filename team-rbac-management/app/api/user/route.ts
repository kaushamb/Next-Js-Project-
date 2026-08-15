import { generateToken, getCurrentUser, verifyPassword } from "@/app/lib/auth";
import { prisma } from "@/app/lib/db";
import { Role } from "@/app/types";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    
    const user= await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        {
          error: "You are not authorized to access user information",
        },
        { status: 401 },
      );
    }
    const searchParams = request.nextUrl.searchParams;
    const teamId = searchParams.get('teamId');
    const role = searchParams.get('role');

    // Build where clause based on user role
    const where: Prisma.UserWhereInput = {};

    if(user.role === Role.ADMIN){
        //Admin can see all Users
    }else if(user.role === Role.MANAGER){
        // managers can see users in their team and cross team users but not cross team managers
        where.OR = [{teamId : user.teamId},{role : Role.USER}]
    }else if(user.role === Role.USER){
        //regular user can only see their team
        where.teamId = user.teamId;
        where.role = { not : Role.ADMIN}
    }
    
    // Additional filters
    if(teamId){
        where.teamId = teamId;
    }
    if(role){
        // where.role = role;
    }
   
    const users = await prisma.user.findMany({
      where,
      select : {
        id: true,
        email: true,
        name: true,
        role: true,
        team : {
            select : {
                id : true,
                name : true
            }
        },
        createdAt : true
      },
      orderBy : {
        createdAt : "desc"
      }
    });

    return NextResponse.json({users});

  } catch (error) {
    console.log("get users error",error);
    return NextResponse.json(
        {
            error: "Internal server error, Something went wrong!"
        },
        { status: 500}
    );
  }
}
