import mongoose from "mongoose";
import mailSender from '../services/emailService.js';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true, 
        unique: true
    }, 
    password: {
        type: String,
        required: true 
    },
    cartItems: {
        type: Object,
        default: {}
    },
    otp: {
        type: String,
        select: false
    },
    otpExpiry: {
        type: Date,
        select: false
    },
    isVerified: {
        type: Boolean,
        default: false
    }
}, { minimize: false });

async function sendVerificationEmail(email, otp) {
    try {
        const mailResponse = await mailSender(
            email,
            "Verify Your Quick-Kart Account",
            `<div>
                <h2>Quick-Kart Verification Code</h2>
                <p>Your OTP is: <strong>${otp}</strong></p>
                <p>This code will expire in 10 minutes.</p>
            </div>`
        );
        return mailResponse;
    } catch (error) {
        console.error("Error sending verification email:", error);
        throw error;
    }
}

userSchema.pre("save", async function (next) {
    if (this.isModified('otp') && this.otp && !this.isVerified) {
        try {
            await sendVerificationEmail(this.email, this.otp);
        } catch (error) {
            return next(error);
        }
    }
    next();
});

const User = mongoose.models.user || mongoose.model('User', userSchema);
export default User;