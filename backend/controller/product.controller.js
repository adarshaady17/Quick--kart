import { v2 as cloudinary } from "cloudinary";
import Product from "../models/product.js";
import fs from "fs";

// Add Product: /api/product/add
export const addProduct = async (req, res) => {
  try {
    // Validate files first
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No images uploaded",
      });
    }

    // Process product data
    let productData;
    try {
      productData = JSON.parse(req.body.productData);
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: "Invalid product data format",
      });
    }

    // Process images in batches to avoid memory overload
    const batchSize = 2;
    const imagesUrl = [];

    for (let i = 0; i < req.files.length; i += batchSize) {
      const batch = req.files.slice(i, i + batchSize);
      const batchResults = await Promise.all(
        batch.map(async (item) => {
          try {
            const result = await cloudinary.uploader.upload(item.path, {
              resource_type: "image",
              folder: "products",
              quality: "auto:good",
            });
            fs.unlinkSync(item.path);
            return result.secure_url;
          } catch (uploadError) {
            console.error(
              "Upload error for file:",
              item.originalname,
              uploadError
            );
            fs.unlinkSync(item.path);
            throw uploadError;
          }
        })
      );
      imagesUrl.push(...batchResults);
    }

    // Create product with pending status
    const newProduct = await Product.create({
      ...productData,
      image: imagesUrl,
      seller: req.user.id,
      status: "pending",
    });

    return res.status(201).json({
      success: true,
      message: "Product submitted for admin approval",
      product: newProduct,
    });
  } catch (error) {
    console.error("Error in addProduct:", error);

    // Clean up any remaining files
    if (req.files) {
      req.files.forEach((file) => {
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message.includes("timeout")
        ? "Upload timed out. Please try smaller files or fewer images."
        : "Failed to add product",
      error: error.message,
    });
  }
};

// Get Product List (only approved products): /api/product/list
export const productList = async (req, res) => {
  try {
    const products = await Product.find({ status: "approved" }).populate(
      "seller",
      "name"
    );
    res.json({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Pending Products (for admin): /api/product/pending
export const getPendingProducts = async (req, res) => {
  try {
    const products = await Product.find({ status: "pending" }).populate(
      "seller",
      "name email"
    );
    res.json({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Approve/Reject Product (admin): /api/product/approve
export const approveProduct = async (req, res) => {
  try {
    const { productId, action, rejectionReason } = req.body;

    if (!["approve", "reject"].includes(action)) {
      return res.status(400).json({
        success: false,
        message: "Invalid action",
      });
    }

    const update = {
      status: action === "approve" ? "approved" : "rejected",
    };

    if (action === "reject") {
      update.rejectionReason =
        rejectionReason || "Product didn't meet our standards";
    }

    const product = await Product.findByIdAndUpdate(productId, update, {
      new: true,
    }).populate("seller", "email name");

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.json({
      success: true,
      message: `Product ${action}d successfully`,
      product,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Seller's Products: /api/product/seller
export const getSellerProducts = async (req, res) => {
  try {
    const products = await Product.find({ seller: req.user.id }).sort({
      createdAt: -1,
    });

    res.json({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get single product: /api/product/id
export const productById = async (req, res) => {
  try {
    const { id } = req.body;
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.json({
      success: true,
      product,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Change product stock: /api/product/stock
export const changeStock = async (req, res) => {
  try {
    const { id, inStock } = req.body;

    const product = await Product.findByIdAndUpdate(
      id,
      { inStock },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.json({
      success: true,
      message: "Product stock updated successfully",
      product,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Product.findByIdAndDelete(id);
    if (!deleted) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    res.json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
