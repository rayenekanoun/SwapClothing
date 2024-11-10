const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
//const APIFeatures = require('./../utils/apiFeatures');
const User = require('../models/userModel');
const factory = require('./handlerFactory');

const filterObj = (obj, ...allowedFields) => {
    console.log("allowed fileds  : \n",allowedFields);
    const newObj = {};
    Object.keys(obj).forEach(el => {
      if (allowedFields.includes(el)) newObj[el] = obj[el];
    });
    console.log("new obj  : \n",newObj);    
    return newObj;
  };

exports.updateMe = catchAsync(async (req, res, next) => {
    // 1) Create error if user POSTs password data
    if (req.body.password || req.body.passwordConfirm) {
    return next(
    new AppError(
    'This route is not for password updates. Please use /updateMyPassword.',
    400
    )
    );
    }
    // 2) Filtered out unwanted fields // kan elli 7ajetna bech nbadlouha fel user
    const filteredBody = filterObj(req.body, 'username', 'email');
    //3) if nothing can be changed throw an error :
    if(Object.keys(filteredBody).length===0){
     return next(new AppError("you can't update those fields", 400));
    } 
    // 4) other than that we Update user document
    const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true
    });
    res.status(200).json({
    status: 'success',
    "fieldsUpdated":Object.keys(filteredBody).length,
    data: {
    user: updatedUser
    }
    });
});




exports.getMe = (req, res, next) => {
    req.params.id = req.user.id;
    next();
    };

exports.getUser = factory.getOne(User);
exports.getAllUsers = factory.getAll(User);


// Do NOT update passwords with this!
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);