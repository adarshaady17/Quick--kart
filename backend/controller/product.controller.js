import { v2 as cloudinary } from "cloudinary";
import Product from "../models/product.js";
import fs from 'fs';
import path from 'path';

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
    const batchSize = 2; // Process 2 images at a time
    const imagesUrl = [];
    
    for (let i = 0; i < req.files.length; i += batchSize) {
      const batch = req.files.slice(i, i + batchSize);
      const batchResults = await Promise.all(
        batch.map(async (item) => {   
          try {
            const result = await cloudinary.uploader.upload(item.path, {
              resource_type: 'image',
              folder: 'products',
              quality: 'auto:good' // Optimize image quality
            });
            fs.unlinkSync(item.path); // Clean up
            return result.secure_url;
          } catch (uploadError) {
            console.error("Upload error for file:", item.originalname, uploadError);
            fs.unlinkSync(item.path); // Clean up even if failed
            throw uploadError;
          }
        })
      );
      imagesUrl.push(...batchResults);
    }

    // Create product
    const newProduct = await Product.create({
      ...productData,
      image: imagesUrl,
    });

    return res.status(201).json({
      success: true,
      message: "Product added successfully",
      product: newProduct
    });
    
  } catch (error) {
    console.error("Error in addProduct:", error);

    // Clean up any remaining files
    if (req.files) {
      req.files.forEach(file => {
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message.includes('timeout') 
        ? "Upload timed out. Please try smaller files or fewer images." 
        : "Failed to add product",
      error: error.message
    });
  }
}
// Get Product: /api/product/list

export const productList = async (req, res) => {
 try {
   const products = await Product.find({});
   res.json({
     success: true,
     products
   })
 } catch (error) {
  console.log(error.message);
   res.json({
     success: false,
     message: error.message
   });
 }
}

// Get single product: /api/product/id
export const productById = async (req, res) => {
  try {
    const { id } = req.body;
    const product = await Product.findById(id);
    res.json({
      success: true,
      product
    })
  } catch (error) {
    console.log(error.message);
    res.json({
      success: false,
      message: error.message
    });
  }
}

// Change product inStock: /api/product/stock
export const changeStock = async (req, res) => {
  try {
     const { id, inStock } = req.body;
     await Product.findByIdAndUpdate(id, { inStock });
     res.json({
       success: true,
       message: "Product stock updated successfully"
     })
  } catch (error) {
    console.log(error.message);
    res.json({
      success: false,
      message: error.message
    });
  }
}
