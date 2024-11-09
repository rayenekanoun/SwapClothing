const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
//const APIFeatures = require('./../utils/apiFeatures');
const User = require('../models/userModel');



// exports.getMe = (req, res, next) => {
//     req.params.id = req.user.id;
//     next();
//     };

exports.getUser = catchAsync(async (req, res, next) => {
      let query = User.findById(req.user._id);
      const doc = await query;
  
      if (!doc) {
        return next(new AppError('No document found with that ID', 404));
      }
  
      res.status(200).json({
        status: 'success',
        data: {
          data: doc
        }
      });
    });