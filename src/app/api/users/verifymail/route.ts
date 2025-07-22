import { connect } from '@/DbConfig/DbConfig';
import User from '@/models/userModels'
import { NextRequest, NextResponse } from 'next/server';


connect()

export async function POST(request: NextRequest) {

    try {
        const reqBody = await request.json()
        const { token } = reqBody
        console.log(token)
        const user = await User.findOne({
            VerifyToken: token,
            VerifyExpires: { $gt: new Date() }
        })
        if (!user) {
            return NextResponse.json({ error: " user not difined" }, { status: 500 });
        }

        console.log(user)

        user.isVerifyed = true
        user.VerifyToken = undefined
        user.VerifyExpires = undefined

        await user.save()
        return NextResponse.json({ message: "Mail verified", success: true, },

            { status: 200 });

    } catch (error: any) {
        return NextResponse.json({ message: 'Error', error: error.message }, { status: 500 });

    }

}