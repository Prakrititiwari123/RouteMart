import mongoose from 'mongoose';

const shopSchema = new mongoose.Schema(
  {
    shopName: {
      type: String,
      required: true,
      trim: true,
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    category: {
      type: String,
      enum: ['MEDICAL', 'GROCERY', 'VEGETABLE', 'PHOTOCOPY'],
      required: true,
    },

    address: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      default: '',
    },

    openingTime: {
      type: String,
      default: '09:00',
    },

    closingTime: {
      type: String,
      default: '21:00',
    },

    deliveryAvailable: {
      type: Boolean,
      default: false,
    },

    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },

      coordinates: {
        type: [Number],
        required: true,
        validate: {
          validator: function (value) {
            return value.length === 2;
          },
          message: 'Coordinates must contain [longitude, latitude]',
        },
      },
    },

    isOpen: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);
shopSchema.index({
  location: '2dsphere',
});

const Shop = mongoose.model('Shop', shopSchema);

export default Shop;
