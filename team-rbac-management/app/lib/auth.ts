import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PassThrough } from "stream";

const JWT_SECRET= process.env.JWT_SECRET_KEY!;

export const hashPassword= async (password: string): Promise<string>=>{
   return bcrypt.hash(password,12);
};

export const verifyPassword= async (password: string, hashedPassword: string):Promise<boolean>=>{
   return bcrypt.compare(password,hashedPassword)
}

export const generateToken=(userId: string): string =>{
   return jwt.sign({userId}, JWT_SECRET,{expiresIn:"7d"});
}
