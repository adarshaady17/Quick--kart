import express from 'express';
import { addProduct, changeStock, productList, productById } from '../controller/product.controller.js';
import { upload } from '../utils/multer.js';
import authSeller from '../middlewares/authSeller.js';

const router = express.Router();

router.route('/add').post(upload.array('image'), authSeller, addProduct);

router.route('/list').get(productList);
router.route('/id').get(productById);
router.route('/stock').post(authSeller, changeStock);

export default router;
