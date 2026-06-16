import Cart from '../models/cart.model.js';
import Product from '../models/product.model.js';

export const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    const existingCartItem = await Cart.findOne({
      user: req.user._id,
      product: productId,
    });

    if (existingCartItem) {
      existingCartItem.quantity += quantity || 1;

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

export const getMyCart = async (req, res) => {
  try {
    const cartItems = await Cart.find({
      user: req.user._id,
    }).populate('product', 'name price stock image');

    const totalAmount = cartItems.reduce(
      (acc, item) => acc + item.product.price * item.quantity,
      0
    );

    res.status(200).json({
      success: true,
      totalItems: cartItems.length,
      totalAmount,
      cartItems,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateCartQuantity = async (req, res) => {
  try {
    const { quantity } = req.body;

    const cart = await Cart.findById(req.params.id);

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart item not found',
      });
    }

    if (cart.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access Denied',
      });
    }

    cart.quantity = quantity;

    await cart.save();

    res.status(200).json({
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

export const removeCartItem = async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.id);

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart item not found',
      });
    }

    if (cart.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access Denied',
      });
    }

    await cart.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Item removed from cart',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
