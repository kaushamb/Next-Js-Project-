import { prisma } from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";

export  async function POST(request: NextRequest){
    try{
        const {name, email, password }= await request.json();
        //validate required fields

        if(!name || !email || !password){
         return NextRequest.json(
            {
                error: "Name, email & password are required or not valid"
            },
            { status: 400}
         )
        }

        //find Existing user 
        const existingUser= await prisma.user.findUnique({
            where : { email },
        });

        if(existingUser){
            return NextResponse.json(
                {
                    error: "User with this email address Exists"
                },
                { status: 400}
            )
        }
    }catch(error){
        
    }
}