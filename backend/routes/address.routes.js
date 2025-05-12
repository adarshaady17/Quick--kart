import express from 'express';
import { addAddress, getAddress } from '../controller/address.controller.js';
import authUser from '../middlewares/authUser.js';

const router=express.Router();

router.route('/add').post(authUser, addAddress);
router.route('/get').get(authUser,getAddress)

export default router;