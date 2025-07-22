import {connect} from '@/DbConfig/DbConfig';
import User from '@/models/userModels'
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import {sendEmail} from '@/helpers/mailer';


connect()

export async function POST(request: NextRequest) {

    try {
        //give data:
        const reqBody = await request.json()
        const { username, email, password } = reqBody
        console.log(reqBody)

        //check user exist or not:
        const userExist = await User.findOne({ email })
        if (userExist) {
            return NextResponse.json({ error: 'User already exist' }, { status: 500 })
        }

        //creat salt using bcryptjs:
        const salt = await bcrypt.genSalt(10)

        //hash password:
        const hashedPassword = await bcrypt.hash(password, salt)

        //create user:
        const user = new User({
            username,
            email,
            password: hashedPassword
        })

        //save user:
        const saveUser = await user.save()
        console.log(saveUser)
         

        //send verification email:
        await sendEmail({ email, emailType: "VERIFY", userId: saveUser._id })
        return NextResponse.json({
            message: 'User register successfully',
            success: true,
            saveUser

    })
    
    } catch (error: any) {
        return NextResponse.json({ error: error.message, status: 500 })
    }
}
