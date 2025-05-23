import express from 'express';
import { 
  addProduct, 
  changeStock, 
  productList, 
  productById,
  getPendingProducts,
  approveProduct,
  getSellerProducts
} from '../controller/product.controller.js';
import { upload } from '../utils/multer.js';
import authUser from "../middlewares/authUser.js";
import authAdmin from "../middlewares/authAdmin.js";

const router = express.Router();

// Seller routes
router.route('/add').post(upload.array('image'), authUser, addProduct);
router.route('/seller').get(authUser, getSellerProducts);

// Admin routes
router.route('/pending').get(authAdmin, getPendingProducts);
router.route('/approve').post(authAdmin, approveProduct);

// Public routes
router.route('/list').get(productList);
router.route('/id').get(productById);
router.route('/stock').post(authUser, changeStock);

export default router;
