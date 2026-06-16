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


export const getAllProducts = async (
  req,
  res
) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const keyword = req.query.keyword
      ? {
          name: {
            $regex: req.query.keyword,
            $options: 'i',
          },
        }
      : {};

    const category = req.query.category
      ? { category: req.query.category }
      : {};

    const filter = {
      ...keyword,
      ...category,
    };

    const totalProducts =
      await Product.countDocuments(filter);

    const products = await Product.find(filter)
      .populate(
        'shop',
        'shopName category'
      )
      .skip((page - 1) * limit)
      .limit(limit);

    res.status(200).json({
      success: true,
      totalProducts,
      currentPage: page,
      totalPages: Math.ceil(
        totalProducts / limit
      ),
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const getProductById = async (
  req,
  res
) => {
  try {
    const product =
      await Product.findById(
        req.params.id
      ).populate(
        'shop',
        'shopName category address'
      );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    res.status(200).json({
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



export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(
      req.params.id
    ).populate('shop');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    if (
      product.shop.owner.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message:
          'You can update only your own products',
      });
    }

    const updatedProduct =
      await Product.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );

    res.status(200).json({
      success: true,
      product: updatedProduct,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



export const deleteProduct = async (
  req,
  res
) => {
  try {
    const product = await Product.findById(
      req.params.id
    ).populate('shop');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    if (
      product.shop.owner.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message:
          'You can delete only your own products',
      });
    }

    await product.deleteOne();

    res.status(200).json({
      success: true,
      message:
        'Product deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};