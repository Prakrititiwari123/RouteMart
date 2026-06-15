import Shop from '../models/shop.model.js';

export const createShop = async (req, res) => {
  try {
    const {
      shopName,
      category,
      address,
      phone,
    } = req.body;

    const existingShop = await Shop.findOne({
      owner: req.user._id,
    });

    if (existingShop) {
      return res.status(400).json({
        success: false,
        message: 'You already have a shop',
      });
    }

    const shop = await Shop.create({
      shopName,
      category,
      address,
      phone,
      owner: req.user._id,
    });

    res.status(201).json({
      success: true,
      shop,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};