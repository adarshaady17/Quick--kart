import express from 'express';
import { 
  adminLogin,
  isAdminAuth,
  adminLogout
} from '../controller/admin.controller.js';
import { 
  getPendingProducts,
  approveProduct,
  productList,
  deleteProduct
} from '../controller/product.controller.js';
import authAdmin from '../middlewares/authAdmin.js';

import { getAllOrders, getSingleOrder, updateOrderStatus } from "../controller/order.controller.js";

const router = express.Router();

// Admin Authentication Routes
router.post('/login', adminLogin);
router.get('/is-auth', authAdmin, isAdminAuth);
router.get('/logout', authAdmin, adminLogout);

// Product Management Routes
router.get('/products/pending', authAdmin, getPendingProducts);
router.post('/products/approve', authAdmin, approveProduct);
router.get('/products/all', authAdmin, productList); 
router.delete('/products/:id', authAdmin, deleteProduct);



router.get("/orders", authAdmin, getAllOrders);
router.get("/orders/:id", authAdmin, getSingleOrder);
router.put("/orders/:id/status", authAdmin, updateOrderStatus);






export default router;