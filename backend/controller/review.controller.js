import Review from "../models/review.js";
import Product from "../models/product.js";

export const addOrUpdateReview = async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;
    if (!productId || !rating) {
      return res
        .status(400)
        .json({ success: false, message: "Missing fields" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    const review = await Review.findOneAndUpdate(
      { product: productId, user: req.user.id },
      { rating, comment },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return res.json({ success: true, message: "Review saved", review });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    const reviews = await Review.find({ product: productId })
      .populate("user", "name")
      .sort({ createdAt: -1 });

    const avg = reviews.length
      ? Math.round(
          (reviews.reduce((a, r) => a + r.rating, 0) / reviews.length) * 10
        ) / 10
      : 0;

    return res.json({
      success: true,
      reviews,
      averageRating: avg,
      count: reviews.length,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
