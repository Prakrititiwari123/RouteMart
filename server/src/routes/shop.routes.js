import express from 'express';

import { createShop, getAllShops, } from '../controllers/shop.controller.js';

import { protect } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/role.middleware.js';

const router = express.Router();

router.get('/', getAllShops);

router.post(
  '/',
  protect,
  authorize('SHOP_OWNER'),
  createShop
);


export default router;