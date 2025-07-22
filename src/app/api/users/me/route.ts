import { connect } from '@/DbConfig/DbConfig';
import User from '@/models/userModels'
import { NextRequest, NextResponse } from 'next/server';
import { getDataFromToken } from '@/helpers/GetDataFromToken'


connect()

export async function POST(request: NextRequest) {
    //extract data from token
    
    // console.log("rakesh")
    try {
        const userId = await getDataFromToken(request)
        
        // console.log("user id is:"+userId)
        const user = await User.findOne({ _id: userId }).select("-password")
        if (!user) {
            return NextResponse.json({ error: "user not found" }, { status: 400 });
        }
        console.log(user)
 
        return NextResponse.json({
            message: "User found",
            data: user

        })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }

}
