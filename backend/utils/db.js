import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      console.error("MONGO_URI is not defined in environment variables");
      throw new Error("Missing MONGO_URI");
    }

    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 15000,
    });
    console.log("Database Connected");
  } catch (error) {
    console.error("MongoDB connection error:", error?.message || error);
  }
};

export default connectDB;
