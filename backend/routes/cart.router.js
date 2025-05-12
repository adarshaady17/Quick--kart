import express from "express";
import authUser from "../middlewares/authUser.js";
import { updateCart } from "../controller/cart.controller.js";

const router = express.Router();

router.route('/update').post(authUser, updateCart);

export default router;
