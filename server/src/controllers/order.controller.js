import Order from '../models/order.model.js';
import Cart from '../models/cart.model.js';
import Product from '../models/product.model.js';

export const createOrder = async (
  req,
  res
) => {
  try {
    const { deliveryType } = req.body;

    const cartItems =
      await Cart.find({
        user: req.user._id,
      }).populate('product');

    if (!cartItems.length) {
      return res.status(400).json({
        success: false,
        message: 'Cart is empty',
      });
    }

    const shopId =
      cartItems[0].product.shop;

    let totalAmount = 0;

    const products = cartItems.map(
      (item) => {
        totalAmount +=
          item.product.price *
          item.quantity;

        return {
          product:
            item.product._id,
          quantity:
            item.quantity,
          price:
            item.product.price,
        };
      }
    );

    const order =
      await Order.create({
        user: req.user._id,
        shop: shopId,
        products,
        totalAmount,
        deliveryType:
          deliveryType ||
          'PICKUP',
      });

    await Cart.deleteMany({
      user: req.user._id,
    });

    res.status(201).json({
      success: true,
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};