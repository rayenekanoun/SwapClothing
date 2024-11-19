const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A clothing item must have a name'],
      trim: true,
      maxlength: [50, 'Name must have less than or equal to 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'A clothing item must have a description'],
      trim: true,
      maxlength: [
        500,
        'Description must have less than or equal to 500 characters',
      ],
    },
    category: {
      type: String,
      trim: true,
      required: [true, 'A clothing item must have a category'],
      enum: ['Shirts', 'Pants', 'Jackets', 'Shoes', 'Accessories', 'Other'],
    },
    size: {
      type: String,
      required: [true, 'A clothing item must have a size'],
      enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Custom'], // Custom size : mathalan costume ...
    },
    condition: {
      type: String,
      required: [true, 'A clothing item must have a condition'],
      enum: ['New', 'Like New', 'Good', 'Worn'],
    },
    location: {
      type: String,
      required: [true, 'A clothing item must have a location'],
      trim: true,
    },
    images: {
      type: [String], // URLs to the images
      required: [true, 'A clothing item must have at least one image'],
    },
    owner: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'A clothing item must belong to a user'],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    views: {
      type: Number,
      default: 0,
    },
    actualPrice: {
      type: Number,
      required: [true, 'A clothing item must have an actual price'],
    },
    // swapRequests: [
    //   {
    //     type: mongoose.Schema.ObjectId,
    //     ref: 'Swap', // Reference to the Swap model
    //   },
    // ],
  },
 {
  toJSON: { virtuals: true, transform: (doc, ret) => { delete ret.__v; delete ret.id; return ret; } },
  toObject: { virtuals: true, transform: (doc, ret) => { delete ret.__v;delete ret.id;  return ret; } }
});

itemSchema.pre(/^find/, function (next) {
  this.select('-__v');
  next();
});

const item = mongoose.model('Item', itemSchema);

module.exports = item;
