const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

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
    active: { type: Boolean, default: false },
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
      ref: 'Item', // Reference to ClothingItem schema
    },
  ],
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
  deviceSessions: [
    {
      deviceId: String,
      lastLogoutTime: Date,
      lastActiveAt:{
        type: Date,
        default: Date.now,
      },
      _id: false,
    },
  ],
});
userSchema.pre(/^find/, function(next) {
  this.select('-__v -active');
  next();
});


userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  // Hash the password  cost : 10
  this.passwordConfirm = undefined;
  this.password = await bcrypt.hash(this.password, 10);
  //console.log(this.password);
  next();
});

// when was tha password changed if it is not a new  user
userSchema.pre('save', function(next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});



userSchema.methods.correctPassword = async function (givenpassword , actualpassword) {
  return await bcrypt.compare(givenpassword, actualpassword);
}

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10,
    );
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};


userSchema.methods.createPasswordResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString('hex');
  const formattedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  this.passwordResetToken = formattedToken;
 //console.log({ resetToken }, this.passwordResetToken);

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};


const User = mongoose.model('User', userSchema);
module.exports = User;
