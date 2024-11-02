const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
//const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Please provide your username!'],
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    //add the .isEmail validator
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    //This only works on CREATE and SAVE
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: 'Passwords are not the same!',
    },
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updateAt: Date,
  bio: {
    type: String,
    valiodate: {
      validator: function (el) {
        return el.length <= 150;
      },
      message: 'Bio must be less than 151 characters',
    },
  },
  subscription: {
    active:{ type :Boolean, default: false},
    startDate: Date,
    endDate: Date,
  },
  photoUrl: String,
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  wishList: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ClothingItem', // Reference to ClothingItem schema
    },
  ],

});


const User = mongoose.model('User', userSchema);
module.exports = User;