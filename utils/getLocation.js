const catchAsync = require('../utils/catchAsync');
const Item = require('../models/itemModel');
const axios = require('axios');
const fetch = require('node-fetch');
const AppError = require('../utils/appError');

exports.getLocation = catchAsync(async (req, res, next) => {
  try {
    const response = await axios.get(
      `https://nominatim.openstreetmap.org/search?q=${req.body.location}&format=json`
    );
    req.body.location = {
      type: 'Point',
      coordinates: [response.data[0].lat, response.data[0].lon],
    };
  } catch (err) {
    return next(new AppError('Location not found', 404));
  }
  next();
});
