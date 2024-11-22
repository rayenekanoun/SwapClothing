const catchAsync = require('../utils/catchAsync');
const Item = require('../models/itemModel');
const axios = require('axios');
const fetch = require('node-fetch');

exports.getLocation = catchAsync(async (req, res, next) => {
  try {
    req.publicIp = req.headers['x-forwarded-for'] ; 
    const response = await axios.get(
      `https://get.geojs.io/v1/ip/geo/${req.publicIp}.json`,
    );
    let { latitude, longitude } = response.data;
    // loc = loc.split(',');
    req.body.location = {
      type: 'Point',
      coordinates: [longitude,latitude],
    };
  } catch (err) {
    req.body.location = {
      type: 'Point',
      coordinates: [0, 0],
    };
  }

  next();
});
