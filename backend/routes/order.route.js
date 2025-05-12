import express from 'express';
import authUser from '../middlewares/authUser.js';
import { getAllOrders, getUserOrders, placeOrderCOD, placeOrderRazor } from '../controller/order.controller.js';
import authSeller from '../middlewares/authSeller.js';


const router=express.Router();

router.route('/cod').post(authUser,placeOrderCOD);
router.route('/user').get(authUser,getUserOrders);
router.route('/seller').get(authSeller,getAllOrders);
router.route('/razor').post(authUser,placeOrderRazor);


export default router;