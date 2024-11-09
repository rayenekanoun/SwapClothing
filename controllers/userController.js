const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
//const APIFeatures = require('./../utils/apiFeatures');
const User = require('../models/userModel');
const factory = require('./handlerFactory');




exports.getMe = (req, res, next) => {
    req.params.id = req.user.id;
    next();
    };

exports.getUser = factory.getOne(User);
exports.getAllUsers = factory.getAll(User);


// Do NOT update passwords with this!
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);