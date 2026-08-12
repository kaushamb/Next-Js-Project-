import { getCurrentUser } from "@/app/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
   
    if (!user) {
      return NextResponse.json(
        {
          error: "You are not authenticated",
        },
        { status: 400 },
      );
    }

    return NextResponse.json(user);

  } catch (error) {
    console.log("error", error);
    return NextResponse.json(
        {
            error: "Internal server error, Something went wrong!"
        },
        { status: 500}
    );
  }
}
