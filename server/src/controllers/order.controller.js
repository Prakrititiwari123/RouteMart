import Order from '../models/order.model.js';
import Cart from '../models/cart.model.js';
import Product from '../models/product.model.js';
import Shop from '../models/shop.model.js';
import generatePickupCode from '../utils/generatePickupCode.js';

export const createOrder = async (req, res) => {
  try {
    const { deliveryType } = req.body;

    const cartItems = await Cart.find({
      user: req.user._id,
    }).populate('product');

    if (!cartItems.length) {
      return res.status(400).json({
        success: false,
        message: 'Cart is empty',
      });
    }

    const shopId = cartItems[0].product.shop;

    let totalAmount = 0;

    const products = cartItems.map((item) => {
      totalAmount += item.product.price * item.quantity;

      return {
        product: item.product._id,
        quantity: item.quantity,
        price: item.product.price,
      };
    });

    const advanceAmount = Number((totalAmount * 0.2).toFixed(2));

    const remainingAmount = Number((totalAmount - advanceAmount).toFixed(2));

    const order = await Order.create({
      user: req.user._id,
      shop: shopId,
      products,
      totalAmount,

      advanceAmount,
      remainingAmount,

      pickupCode: generatePickupCode(),

      deliveryType: deliveryType || 'PICKUP',
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

export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      user: req.user._id,
    })
      .populate('shop', 'shopName category')
      .populate('products.product', 'name price');

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getShopOrders = async (req, res) => {
  try {
    const shop = await Shop.findOne({
      owner: req.user._id,
    });

    if (!shop) {
      return res.status(404).json({
        success: false,
        message: 'Shop not found',
      });
    }

    const orders = await Order.find({
      shop: shop._id,
    })
      .populate('user', 'name email phone')
      .populate('products.product', 'name price');

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    order.orderStatus = orderStatus;

    await order.save();

    res.status(200).json({
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

export const verifyPickupCode = async (req, res) => {
  try {
    const { code } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    if (order.pickupCode !== code) {
      return res.status(400).json({
        success: false,
        message: 'Invalid Pickup Code',
      });
    }

    order.pickupVerified = true;

    order.orderStatus = 'DELIVERED';
    order.paymentStatus = 'PAID';

    await order.save();

    res.status(200).json({
      success: true,
      message: 'Pickup Verified Successfully',
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const payAdvanceAmount = async (
  req,
  res
) => {
  try {
    const order = await Order.findById(
      req.params.id
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    order.advancePaid = true;

    order.paymentStatus = 'PARTIAL';

    await order.save();

    res.status(200).json({
      success: true,
      message:
        'Advance Payment Successful',
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
