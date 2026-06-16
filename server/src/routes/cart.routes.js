import express from 'express';

import {
  addToCart,
  getMyCart,
  updateCartQuantity,
  removeCartItem
} from '../controllers/cart.controller.js';

import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/', protect, getMyCart);
router.put('/:id', protect, updateCartQuantity);
router.post('/', protect, addToCart);
router.delete(
  '/:id',
  protect,
  removeCartItem
);

export default router;
