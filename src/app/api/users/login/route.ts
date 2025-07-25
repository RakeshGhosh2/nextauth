import { connect } from '@/DbConfig/DbConfig';
import User from '@/models/userModels'
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken"


connect()

export async function POST(request: NextRequest) {
    
    try {

        const reqBody = await request.json()
        const { email, password } = reqBody

        console.log(reqBody)

        const user = await User.findOne({ email })

        if (!user) {
            return NextResponse.json({ error: "User does not exists" }, { status: 400 })
        }

        console.log(user)
        const isValidPassword = await bcrypt.compare(password, user.password)

        if (!isValidPassword) {
            return NextResponse.json({ error: "Invalid password" }, { status: 400 })
        }

        const tokenData = {
            id: user._id,
            email: user.email,
            username: user.username
        }

        const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET!, { expiresIn: '1d' })

        const response = NextResponse.json({
            message: "Logged in successfully",
            success: true,
        })
        response.cookies.set("token", token, {
            httpOnly: true,
        })

        return response


    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })

    }

}