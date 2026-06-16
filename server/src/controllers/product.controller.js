import Product from '../models/product.model.js';
import Shop from '../models/shop.model.js';

export const createProduct = async (
  req,
  res
) => {
  try {
    const {
      shopId,
      name,
      description,
      category,
      price,
      stock,
      image,
    } = req.body;

    const shop = await Shop.findById(shopId);

    if (!shop) {
      return res.status(404).json({
        success: false,
        message: 'Shop not found',
      });
    }

    // Owner Check
    if (
      shop.owner.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message:
          'You can add products only to your own shop',
      });
    }

    const product =
      await Product.create({
        shop: shopId,
        name,
        description,
        category,
        price,
        stock,
        image,
      });

    res.status(201).json({
      success: true,
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};