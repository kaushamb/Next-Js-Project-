import bcrypt from "bcryptjs";
import { PassThrough } from "stream";

export const hashPassword=(password)=>{
   return bcrypt.hash(password,12);
};

export const verifyPassword= async (password: string, hashedPassword: string):Promise<boolean>{
   return bcrypt.compare(password,hashedPassword)
}