import express from 'express';
import authUser from '../middlewares/authUser.js';
import { getAllOrders, getUserOrders, placeOrderCOD, placeOrderRazor } from '../controller/order.controller.js';
import authAdmin from '../middlewares/authAdmin.js';


const router=express.Router();

router.route('/cod').post(authUser,placeOrderCOD);
router.route('/user').get(authUser,getUserOrders);
router.route('/seller').get(authUser,getAllOrders);
router.route('/razor').post(authUser,placeOrderRazor);
//router.route('/:id').put(authAdmin, updateOrder);


export default router;