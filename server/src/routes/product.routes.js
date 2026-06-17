import express from 'express';

import { createProduct,getAllProducts,getProductById,updateProduct,
deleteProduct,searchProducts,getProductsByShop } from '../controllers/product.controller.js';

import { protect } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/role.middleware.js';

const router = express.Router();


router.get('/', getAllProducts);
router.get('/search', searchProducts);
router.get(
  '/shop/:shopId',
  getProductsByShop
);
router.get('/:id', getProductById);


router.put(
  '/:id',
  protect,
  authorize('SHOP_OWNER'),
  updateProduct
);

router.delete(
  '/:id',
  protect,
  authorize('SHOP_OWNER'),
  deleteProduct
);

router.post(
  '/',
  protect,
  authorize('SHOP_OWNER'),
  createProduct
);

export default router;