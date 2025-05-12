import express from 'express';
import { isSellerAuth,sellerLogin,sellerLogout } from '../controller/seller.controller.js';
import authSeller from '../middlewares/authSeller.js';

const router=express.Router();

router.route('/login').post(sellerLogin);
router.route('/is-auth').get(authSeller,isSellerAuth);
router.route('/logout').get(authSeller,sellerLogout);

export default router;