import express from 'express';

import { createOrder }
from '../controllers/order.controller.js';

import { protect }
from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post(
  '/',
  protect,
  createOrder
);

export default router;