import User from "../models/user.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";


export const registration = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required", success: false });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists", success: false });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      otp,
      otpExpiry,
      isVerified: false // Explicitly set to false
    });

    // Don't create token yet - wait for verification
    return res.status(201).json({
      message: "OTP sent to your email. Please verify.",
      success: true,
      email: user.email // Return email for verification
    });
  } catch (error) {
    console.error("Registration error:", error.message);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email }).select('+otp +otpExpiry');
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (user.isVerified) {
      return res.json({ success: true, message: "Email already verified" });
    }

    if (user.otp !== otp || user.otpExpiry < Date.now()) {
      return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
    }

    // Mark as verified and clear OTP fields
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    // Now create and send token
    const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({ 
      success: true, 
      message: "Email verified successfully",
      user: { email: user.email, name: user.name }
    });
  } catch (error) {
    console.error("OTP verification error:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const resendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: "User not found" 
      });
    }

    if (user.isVerified) {
      return res.json({ 
        success: true, 
        message: "Email already verified" 
      });
    }

    // Generate new OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes

    // Update user with new OTP
    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();

    return res.json({ 
      success: true, 
      message: "New OTP sent successfully" 
    });
  } catch (error) {
    console.error("Resend OTP error:", error.message);
    res.status(500).json({ 
      success: false, 
      message: "Server error" 
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.json({
        success: false,
        message: "Please fill all the fields",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.json({ 
        success: false, 
        message: "User not found" 
      });
    }

    // Check if user is verified
    if (!user.isVerified) {
      return res.json({ 
        success: false, 
        message: "Please verify your email first" 
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.json({ 
        success: false, 
        message: "Invalid Password" 
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    
    return res.json({ 
      success: true,
      message: "Login successful",
      user: { email: user.email, name: user.name },
    });
  } catch (error) {
    console.log(error.message);
    res.json({ 
      success: false, 
      message: error.message 
    });
  }
};

  export const isAuth = async (req, res) => {
    try {
      const { id: userId } = req.user; 
  
      if (!userId) {
          return res.json({ success: false, message: "Unauthorized" });
      }
      const user = await User.findById(userId).select("-password ");
  
      return res.json({ success: true, user });
    } catch (error) {
      console.log(error.message);
      res.json({ success: false, message: error.message });
    }
  };
  
  export const logout = async (req, res) => {
    try {
    
      res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        path: "/",
  
      });
  
      return res.json({ success: true, message: "Logged out successfully" });
    } catch (error) {
      console.log(error.message);
      res.json({ success: false, message: error.message });
    }
  };
  