import Razorpay from "razorpay";
import Order from "../models/order.js";
import Product from "../models/product.js";

export const placeOrderRazor = async (req, res) => {
  try {
    const { userId, items, address } = req.body;
    const { origin } = req.headers;

    if (!userId || !address || items.length === 0) {
      return res.json({ success: false, message: "Invalid data" });
    }


    let productData = [];
    let amount = await items.reduce(async (acc, item) => {
      const product = await Product.findById(item.product);
      productData.push({
        name: product.name,
        price: product.offerPrice,
        quantity: item.quantity,
      });
      return (await acc) + product.offerPrice * item.quantity;
    }, 0);

    // Add tax (2%)
    amount += Math.floor(amount * 0.02);

    // Create order in MongoDB
    const order = await Order.create({
      userId,
      items,
      address,
      amount,
      paymentType: "Online",
    });

    // Initialize Razorpay
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY,
      key_secret: process.env.RAZORPAY_SECRET,
    });

    // Create payment order in Razorpay
    const paymentOrder = await razorpay.orders.create({
      amount: amount * 100, // in paise
      currency: "INR",
      receipt: order._id.toString(),
      notes: {
        userId,
        address,
      },
    });

    res.json({
      success: true,
      orderId: paymentOrder.id,
      amount: paymentOrder.amount,
      currency: paymentOrder.currency,
      receipt: paymentOrder.receipt,
    });
  } catch (error) {
    console.error("Razorpay error:", error.message);
    res.status(500).json({
      success: false,
      message: "Error creating Razorpay order",
      error: error.message,
    });
  }
};


export const placeOrderCOD = async (req, res) => {
  try {
    const { items, address } = req.body;
    const userId = req.user.id; // Get userId from authenticated user

    if (!userId) {
      return res.json({
        success: false,
        message: "User authentication required",
      });
    }

    if (!address || items.length === 0) {
      return res.json({
        success: false,
        message: "Address and items are required",
      });
    }

    let amount = await items.reduce(async (acc, item) => {
      const product = await Product.findById(item.product);
      return (await acc) + product.offerPrice * item.quantity;
    }, 0);
    amount += Math.floor(amount * 0.02);

    await Order.create({
      userId, // Now using the authenticated user's ID
      items,
      address,
      amount,
      paymentType: "COD",
    });

    res.json({
      success: true,
      message: "Order placed successfully",
    });
  } catch (error) {
    console.log(error.message);
    res.json({
      success: false,
      message: "Error in placing order",
      error: error.message,
    });
  }
};

export const getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const orders = await Order.find({
      userId,
      $or: [{ paymentType: "COD" }, { isPaid: true }],
    })
      .populate({
        path: "items.product",
        select: "name image category offerPrice",
      })
      .populate("address")
      .sort({ createdAt: -1 });
    res.json({
      success: true,
      orders: orders,
    });
  } catch (error) {
    console.log(error.message);
    res.json({
      success: false,
      message: "Error in placing order",
      error: error.message,
    });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      $or: [{ paymentType: "COD" }, { isPaid: true }],
    })
      .populate("items.product address")
      .sort({ createdAt: -1 });
    res.json({
      success: true,
      orders: orders,
    });
  } catch (error) {
    console.log(error.message);
    res.json({
      success: false,
      message: "Error in placing order",
      error: error.message,
    });
  }
};
