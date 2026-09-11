"use client"
import { apiClient } from "@/app/lib/apiClient";
import Link from "next/link";
import { useActionState } from "react";

export type RegisterState={
    error?: string;
    success?: boolean;
}
const RegisterPage =()=>{
    const [state,registerAction, isPending]= useActionState(
        async (prevState: RegisterState,formData:FormData):Promise<RegisterState>=>{
            const name= formData.get("name") as string;
            const email= formData.get("email") as string;
            const password= formData.get("password") as string;
            const teamCode= formData.get("teamCode") as string;

            try{
                await apiClient.register({
                    name, email, password, teamCode: teamCode|| undefined
                })
                window.location.href="/dashboard";
                return {success:true};
            }catch(error){
                console.log("Error",error)
                return {
                    error : error instanceof Error ? error.message : "Registration failed"
                };
            }
        },
        { error : undefined, success: undefined},
    )
    return (
        <div className="bg-slate-800 p-8 rounded-lg border border-slate-700 w-full max-w-md">
            <form action={registerAction}>
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-white">Create new account</h2>
                    <p className="mt-2 text-sm text-slate-400">
                        or{" "}
                        <Link 
                            href="/login"
                            className="font-medium text-blue-400 hover:text-blue-300"
                        >
                            sign in to existing account
                        </Link>
                    </p>
                </div>
                {state.error && (
                    <div className="bg-red-900/50 border border-red-700 text-red-300 px- py-3 rounded mb-4">
                        {state.error}
                    </div>
                )}
                <div className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text">
                            Full Name
                        </label>
                    </div>
                </div>
            </form>
        </div>
    )
}
export default RegisterPage;