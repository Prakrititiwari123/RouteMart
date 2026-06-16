import express from 'express';

import { createProduct,getAllProducts,getProductById } from '../controllers/product.controller.js';

import { protect } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/role.middleware.js';

const router = express.Router();


router.get('/', getAllProducts);
router.get('/:id', getProductById);

router.post(
  '/',
  protect,
  authorize('SHOP_OWNER'),
  createProduct
);

export default router;