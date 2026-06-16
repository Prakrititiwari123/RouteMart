import express from 'express';

import {
  createOrder,
  getMyOrders,
  getShopOrders,
  updateOrderStatus,
  verifyPickupCode,
  payAdvanceAmount,
} from '../controllers/order.controller.js';

import { protect } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/role.middleware.js';

const router = express.Router();

router.post('/', protect, createOrder);
router.get('/my-orders', protect, getMyOrders);
router.get('/shop-orders', protect, authorize('SHOP_OWNER'), getShopOrders);
router.put('/:id/status', protect, authorize('SHOP_OWNER'), updateOrderStatus);
router.put(
  '/:id/verify-pickup',
  protect,
  authorize('SHOP_OWNER'),
  verifyPickupCode
);
router.put('/:id/pay-advance', protect, payAdvanceAmount);
export default router;
