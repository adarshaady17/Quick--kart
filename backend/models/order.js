import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type:String,
      required: true,
      ref: "User",
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: "product",
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],

    amount: {
      type: Number,
      required: true,
    },
    address: {
      type: String,
      required: true,
      ref: "address",
    },
    status: {
      type: String,
      enum: ["Order Placed", "Processing", "Shipped", "Delivered", "Cancelled"],
      default: "Order Placed",
    },
     paymentType: {
      type: String,
      enum: ["COD", "Online"],
      required: true,
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Order = mongoose.models.order || mongoose.model("order", orderSchema);

export default Order;
