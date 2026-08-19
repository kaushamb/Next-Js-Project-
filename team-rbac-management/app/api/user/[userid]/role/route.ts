import { CheckUserPermission, getCurrentUser } from "@/app/lib/auth";
import { prisma } from "@/app/lib/db";
import { Role } from "@/app/types";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ userId: string }> },
) {
  try {
    const { userId } = await context.params;
    const currentUser = await getCurrentUser();

    if (!currentUser || !CheckUserPermission(currentUser, Role.ADMIN)) {
      return NextResponse.json(
        {
          error: "You are not authorized to assign the team",
        },
        { status: 401 },
      );
    }

    //prevent user to changing their on role
    if (userId === currentUser.id) {
      return NextResponse.json(
        {
          error: "You can not change your own role",
        },
        { status: 401 },
      );
    }

    const { role } = await request.json();

    const validateRoles = [Role.USER, Role.MANAGER];

    if (!validateRoles.includes(role)) {
      return NextResponse.json(
        {
          error:
            "Invalid role or you can not have more then one Admin role user",
        },
        { status: 404 },
      );
    }

    //update user's team assignment
    const updateUser = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
       role,
      },
      include: {
        team: true,
      },
    });
    return NextResponse.json({
      user: updateUser,
      message: `User role updated to ${role} successfully`,
    });
  } catch (error) {
    console.log("Role assignment error!", error);
    if (
      error instanceof Error &&
      error.message.includes("Record to update not found")
    ) {
      return NextResponse.json(
        {
          message: "User not found",
        },
        { status: 404 },
      );
    }
    return NextResponse.json(
      {
        message: "Internal server error! something went wrong",
      },
      { status: 500 },
    );
  }
}
