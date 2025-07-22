import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export const getDataFromToken = (request: NextRequest) => {

    try {
        
        const token = request.cookies.get('token')?.value
        if (!token) {
            throw new Error("Token not found in cookies");
        }
        // console.log("token is:"+token)
        const decoded: any = jwt.verify(token, process.env.TOKEN_SECRET!);
        
        return decoded.id;
        
        
    } catch (error: any) {
        throw new Error(error.message);

    }

}