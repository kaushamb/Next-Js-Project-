import { generateToken, hashPassword } from "@/app/lib/auth";
import { prisma } from "@/app/lib/db";
// import { prisma } from "";
import { Role } from "@/app/types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, teamCode } = await request.json();
    //validate required fields

    if (!name || !email || !password) {
      return NextResponse.json(
        {
          error: "Name, email & password are required or not valid",
        },
        { status: 400 },
      );
    }

    //find Existing user
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        {
          error: "User with this email address Exists",
        },
        { status: 409 },
      );
    }

    let teamId: string | undefined;
    if (teamCode) {
      const team = await prisma.team.findUnique({
        where: { code: teamCode },
      });

      if (!team) {
        return NextResponse.json(
          {
            error: "Please enter a valid team code.",
          },
          { status: 400 },
        );
      }
      teamId = team.id;
    }

    const hashedPassword= await hashPassword(password);

    //first user to become admin others becomes user
    const userCount = await prisma.user.count();
    const role = userCount === 0 ? Role.ADMIN : Role.USER;

    const user = await prisma.user.create({
        data: {
            name,
            email,
            password:hashedPassword,
            role,
            teamId
        },
        include:{
            team: true
        }
    });
  
    //Generate Token 
    const token = generateToken(user.id)

    //Create response
    const response = NextResponse.json({
        user:{
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            teamId: user.teamId,
            team: user.team,
            token,
        },
    })

    //Set Cookie 

    response.cookies.set("token", token ,{
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
    })
     return response;

  } catch (error) {
    console.log("Registration failed");
    return NextResponse.json(
        {
            error: "Internal server error, Something went wrong!"
        },
        { status: 500}
    );
  }
}
