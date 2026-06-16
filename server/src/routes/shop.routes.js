import express from 'express';

import { createShop, getAllShops, getShopById,
  updateShop, } from '../controllers/shop.controller.js';

import { protect } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/role.middleware.js';

const router = express.Router();

router.get('/', getAllShops);

router.get('/:id', getShopById);

router.put(
  '/:id',
  protect,
  authorize('SHOP_OWNER'),
  updateShop
);

router.post(
  '/',
  protect,
  authorize('SHOP_OWNER'),
  createShop
);


export default router;