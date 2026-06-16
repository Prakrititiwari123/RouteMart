import Cart from '../models/cart.model.js';
import Product from '../models/product.model.js';

export const addToCart = async (
  req,
  res
) => {
  try {
    const {
      productId,
      quantity,
    } = req.body;

    const product =
      await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    const existingCartItem =
      await Cart.findOne({
        user: req.user._id,
        product: productId,
      });

    if (existingCartItem) {
      existingCartItem.quantity +=
        quantity || 1;

      await existingCartItem.save();

      return res.status(200).json({
        success: true,
        cart: existingCartItem,
      });
    }

    const cart = await Cart.create({
      user: req.user._id,
      product: productId,
      quantity: quantity || 1,
    });

    res.status(201).json({
      success: true,
      cart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};