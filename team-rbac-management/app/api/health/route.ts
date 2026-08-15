import { NextResponse } from "next/server";
import { checkDataBaseConnection } from "@/app/lib/db";

export async function GET(){
    const isConnected = await checkDataBaseConnection();
    if(!isConnected){
        return NextResponse.json(
            {
                status:"error",
                message:"Database conection is failed",
            },
            {status:503}
        );
    }
    return NextResponse.json(
            {
                status:"ok",
                message:"Database connected successfully",
            },
            {status:200}
        );
}