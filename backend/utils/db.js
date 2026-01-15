import mongoose from "mongoose";

const connectDB = async () => {
  try {
    // Check if already connected (important for serverless/function reuse)
    if (mongoose.connection.readyState === 1) {
      console.log("Database already connected");
      return;
    }

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
    throw error; // Re-throw to handle in calling code
  }
};

export default connectDB;
