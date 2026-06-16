import express from 'express';

import { addToCart } from '../controllers/cart.controller.js';

import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post(
  '/',
  protect,
  addToCart
);

export default router;