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
exports.deleteAllItems = factory.deleteAll(Item);
exports.getItemsWithin = catchAsync(async (req, res, next) => {
    const { distance, latlng, unit } = req.params;
    console.log(distance, latlng, unit);
    
    const [lat, lng] = latlng.split(',');
    if (!lat || !lng) {
        return next(new AppError('Please provide latitude and longitude in the format lat,lng.', 400));
    }
    
    const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;
    console.log(radius);
    const items = await Item.find({
        location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
    });
    
    res.status(200).json({
        status: 'success',
        results: items.length,
        data: {
        data: items,
        },
    });
});
