
import nodemailer from 'nodemailer';
import bcrypt from 'bcryptjs';
import User from '@/models/userModels';

export const sendEmail = async ({ email, emailType, userId }: { email: string, emailType: string, userId: string }) => {
    try {
        if (!userId) {
            throw new Error("User ID is undefined in sendEmail()");
        }

        // Create hashed token from userId
        const hashedToken = await bcrypt.hash(userId.toString(), 10);

        // Update user token fields in the database
        if (emailType === 'VERIFY') {
            await User.findByIdAndUpdate(userId, {
                $set: {
                    VerifyToken: hashedToken,
                    VerifyExpires: Date.now() + 3600000,
                }
            });
        } else if (emailType === 'RESET') {
            await User.findByIdAndUpdate(userId, {
                $set: {
                    ForgotPasswordToken: hashedToken,
                    ForgotPasswordExpires: Date.now() + 3600000,
                }
            });
        }

        // Set up nodemailer transporter using Mailtrap

        const transporter = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
                user: "e632c470c225b8",
                pass: "b7efa736622e2c"
            }
        });

        // Prepare email content
        const mailOptions = {
            from: 'rahulghosh112345@gmail.com',
            to: email,
            subject: emailType === "VERIFY" ? "Verify Your Account" : "Reset Your Password",
            html: `
                <p>Click
                    <a href="${process.env.DOMAIN}/verifyemail?token=${hashedToken}">
                        here
                    </a>
                    to ${emailType === "VERIFY" ? "verify your email" : "reset your password"}.
                    <br>
                    Or copy and paste the link below in your browser:
                    <br>
                    ${process.env.DOMAIN}/verifyemail?token=${hashedToken}
                </p>`
        };

        // Send email
        const sendMailer = await transporter.sendMail(mailOptions);
        return sendMailer;

    } catch (error: any) {
        throw new Error(error.message);
    }
};
