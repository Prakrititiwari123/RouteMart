import express from 'express';

import { createShop } from '../controllers/shop.controller.js';

import { protect } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/role.middleware.js';

const router = express.Router();

router.post(
  '/',
  protect,
  authorize('SHOP_OWNER'),
  createShop
);

export default router;