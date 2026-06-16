import express from 'express';

import {
  createShop,
  getAllShops,
  getShopById,
  updateShop,
  deleteShop,
  getNearbyShops,
  getMyShop,
  updateMyShop,
} from '../controllers/shop.controller.js';

import { protect } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/role.middleware.js';

const router = express.Router();

router.put('/my-shop', protect, authorize('SHOP_OWNER'), updateMyShop);
router.get('/my-shop', protect, authorize('SHOP_OWNER'), getMyShop);
router.get('/nearby', getNearbyShops);
router.get('/', getAllShops);
router.get('/:id', getShopById);

router.put('/:id', protect, authorize('SHOP_OWNER'), updateShop);

router.delete('/:id', protect, authorize('SHOP_OWNER'), deleteShop);
router.post('/', protect, authorize('SHOP_OWNER'), createShop);

export default router;
