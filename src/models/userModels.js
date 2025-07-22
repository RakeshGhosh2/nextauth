import mongoose from "mongoose";

const userScema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "username is required"],
        unique: true

    },
    password: {
        type: String,
        required: [true, "password is required"],
    },
    email: {
        type: String,
        required: [true, "email is required"],
        unique: true
    },
    isVerifyed: {
        type: Boolean,
        default: false

    },
    isAdmin: {
        type: Boolean,
        default: false

    },
    ForgotPasswordToken: String,
    ForgotPasswordExpires: Date,
    VerifyToken: String,
    VerifyExpires: Date

})
const User = mongoose.models.users || mongoose.model("users", userScema);
export default User;
