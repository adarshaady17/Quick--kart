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
connectDB();
await connectCloudinary();

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

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => res.send("API is working"));

app.use("/api/v1/user", UserRouter);
app.use("/api/v1/admin", AdminRouter);
app.use("/api/v1/product", ProductRouter);
app.use("/api/v1/cart", CartRouter);
app.use("/api/v1/address", AddressRouter);
app.use("/api/v1/order", OrderRouter);
app.use("/api/v1/review", ReviewRouter);

app.listen(PORT, () => {
  console.log(`Server is running at ${PORT}`);
});
