import Shop from '../models/shop.model.js';

export const createShop = async (req, res) => {
  try {
    const {
      shopName,
      category,
      address,
      phone,
      description,
      openingTime,
      closingTime,
      deliveryAvailable,
      longitude,
      latitude,
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
      description,
      openingTime,
      closingTime,
      deliveryAvailable,
      location: {
        type: 'Point',
        coordinates: [longitude, latitude],
      },
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



export const getAllShops = async (req, res) => {
  try {
    const shops = await Shop.find().populate('owner', 'name email phone');

    res.status(200).json({
      success: true,
      count: shops.length,
      shops,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



export const getShopById = async (req, res) => {
  try {
    const shop = await Shop.findById(req.params.id)
      .populate('owner', 'name email phone');

    if (!shop) {
      return res.status(404).json({
        success: false,
        message: 'Shop not found',
      });
    }

    res.status(200).json({
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



export const updateShop = async (req, res) => {
  try {
    const shop = await Shop.findById(req.params.id);

    if (!shop) {
      return res.status(404).json({
        success: false,
        message: 'Shop not found',
      });
    }

    // Ownership Check
    if (shop.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can update only your own shop',
      });
    }

    const updatedShop = await Shop.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      shop: updatedShop,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};