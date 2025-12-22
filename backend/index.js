import express from "express";
import dns from "dns";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import cookieParser from "cookie-parser";
import UserRouter from "./routes/user.routes.js";
import connectCloudinary from "./utils/cloudinary.js";
import cors from "cors";
import AdminRouter from "./routes/admin.routers.js";
import ProductRouter from "./routes/product.routes.js";
import CartRouter from "./routes/cart.router.js";
import AddressRouter from "./routes/address.routes.js";
import OrderRouter from "./routes/order.route.js";
import ReviewRouter from "./routes/review.routes.js";

const app = express();
dotenv.config({});

// Force DNS resolution to use public resolvers to avoid ETIMEOUT on SRV/TXT lookups (e.g., Atlas)
// This helps in environments where the default DNS blocks TXT/SRV queries
try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch (err) {
  console.error("Failed to set custom DNS servers:", err?.message || err);
}

// Initialize database and Cloudinary connections (lazy initialization for Vercel)
let dbConnected = false;
let cloudinaryConnected = false;
let initPromise = null;

const initializeConnections = async () => {
  if (initPromise) return initPromise;
  
  initPromise = (async () => {
    if (!dbConnected) {
      await connectDB();
      dbConnected = true;
    }
    if (!cloudinaryConnected) {
      await connectCloudinary();
      cloudinaryConnected = true;
    }
  })();
  
  return initPromise;
};

// Initialize connections before handling requests
app.use(async (req, res, next) => {
  try {
    await initializeConnections();
    next();
  } catch (error) {
    console.error("Connection initialization error:", error);
    res.status(500).json({ success: false, message: "Server initialization error" });
  }
});

// Add these before your routes
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Increase timeout to 10 minutes (adjust as needed)
app.use((req, res, next) => {
  req.setTimeout(10 * 60 * 1000); // 10 minutes
  res.setTimeout(10 * 60 * 1000); // 10 minutes
  next();
});

app.use(cookieParser());

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

app.get("/", (req, res) => res.send("API is working"));

app.use("/api/v1/user", UserRouter);
app.use("/api/v1/admin", AdminRouter);
app.use("/api/v1/product", ProductRouter);
app.use("/api/v1/cart", CartRouter);
app.use("/api/v1/address", AddressRouter);
app.use("/api/v1/order", OrderRouter);
app.use("/api/v1/review", ReviewRouter);

// Only start server when not in Vercel environment
const PORT = process.env.PORT || 5000;

if (process.env.VERCEL !== "1") {
  // Initialize connections and start server for local development
  (async () => {
    try {
      await connectDB();
      await connectCloudinary();
      app.listen(PORT, () => {
        console.log(`Server is running at ${PORT}`);
      });
    } catch (error) {
      console.error("Failed to start server:", error);
      process.exit(1);
    }
  })();
}

// Export app for Vercel serverless functions
export default app;
