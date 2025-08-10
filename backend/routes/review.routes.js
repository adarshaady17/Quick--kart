import express from "express";
import {
  addOrUpdateReview,
  getProductReviews,
} from "../controller/review.controller.js";
import authUser from "../middlewares/authUser.js";

const router = express.Router();

// Add or update a review
router.post("/", authUser, addOrUpdateReview);

// Get reviews for a product
router.get("/:productId", getProductReviews);

export default router;
