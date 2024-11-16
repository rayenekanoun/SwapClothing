const Item = require('../models/itemModel');
const factory = require('./handlerFactory');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');

exports.getAllItems = factory.getAll(Item); 
exports.getItem = factory.getOne(Item , {path: 'owner'});
exports.createItem = factory.createOne(Item);
exports.updateItem = factory.updateOne(Item);
exports.deleteItem = factory.deleteOne(Item);
exports.deleteAllItem = factory.deleteAll(Item);
