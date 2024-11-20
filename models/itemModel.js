const mongoose = require('mongoose');
const { z } = require('zod');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');



const itemSchema = new mongoose.Schema(
  {
    name: String,
    description: String,
    category: String,
    size: String,
    condition: String,
     location: String,
   images: [String],
    owner: { type: mongoose.Schema.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now },
    isAvailable: { type: Boolean, default: true },
    views: { type: Number, default: 0 },
    actualPrice: Number,
  },
  {
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        delete ret.__v;
        delete ret.id;
        return ret;
      },
    },
    toObject: {
      virtuals: true,
      transform: (doc, ret) => {
        delete ret.__v;
        delete ret.id;
        return ret;
      },
    },
  }
);

// itemSchema.pre('save',(next)=>{
//   console.log(typeof this);
//   next();
// });


const Item = mongoose.model('Item', itemSchema);

module.exports = Item;
