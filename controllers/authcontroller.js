const User = require('../models/userModel');
//const redisClient = require('../utils/redisClient'); // for cashing so i querry the DB less often
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const appError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const sendEmail = require('../utils/email');
//const { compareSync } = require('bcryptjs');

const signAcessToken = (id) => {
  return jwt.sign({ id }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.JWT_ACCESS_EXPIRES_IN,
  });
};
const signRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
  });
};

const createSendToken = catchAsync(async (
  user,
  statusCode,
  res,

) => {
  const accessToken = signAcessToken(user._id);
  const refreshToken = signRefreshToken(user._id);
  //console.log( " refresh 2", refreshToken);
  //console.log(accessToken);
  // Store the refresh token in Redis with expiration time // for later development
  // await redisClient.setex(
  //   user._id.toString(),
  //   parseInt(process.env.JWT_REFRESH_EXPIRES_IN *24 * 60 * 60 * 1000, 10), // Expiration time in seconds
  //   refreshToken
  //   );
  const cookieOptions = {
    expires: 
     new Date(
          Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
        ),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
  };
  res.cookie('refreshToken', refreshToken, cookieOptions);

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    accessToken,
    data: {
      user,
    },
  });
});

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    photoUrl: req.body.photoUrl,
  });
  createSendToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  // check if email and password E
  if (!email || !password) {
    return next(new appError('Please provide email and password!', 400));
  }
  // check if user exists && password is correct
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    return next(new appError('there is no user with this email', 401));
  }
  if (!(await user.correctPassword(password, user.password)))
    return next(new appError('password is not correct', 401));

  createSendToken(user, 200, res);
});

exports.protect = catchAsync(async (req, res, next) => {
  //get token
  let accesstoken;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    accesstoken = req.headers.authorization.split(' ')[1];
  }
  if (!accesstoken) {
    return next(
      new appError('You are not logged in! Please log in to get access.', 401),
    );
  }
  
  //validate token //it throws an error if the token is invalid Such as (TokenExpiredError ....)
  const decoded = await jwt.verify(
    accesstoken,
    process.env.ACCESS_TOKEN_SECRET,
  );
  //check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new appError(
        'The user belonging to this token does no longer exist.',
        401,
      ),
    );
  }
  //check if user changed password after the token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new appError('User recently changed password! Please log in again.', 401),
    );
  }
  req.user = currentUser;
  next();
});

exports.refresh = catchAsync(async (req, res, next) => {
  let refreshToken;
  if (req.cookies.refreshToken) refreshToken = req.cookies.refreshToken;
  if (!refreshToken)
    return next(new appError('no refresh token is assigned ', 401));
  const decoded = await jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
  );

  // // Get stored token from Redis // for later development
  // const storedRefreshToken = await redisClient.get(decoded.id);
  // if (storedRefreshToken !== refreshToken) {
  //   return next(new appError('Invalid refresh token', 403));
  // }

  // console.log( " refresh 1", refreshToken);
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new appError(
        'The user belonging to this token does no longer exist.',
        401,
      ),
    );
  }
  createSendToken(currentUser, 200, res);
});



exports.forgotPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email : req.body.email });
  if (!user) {
    return next(new appError('There is no user with email address.', 404));
  }
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });
  // Send it to user's email
  const resetURL = `${req.protocol}://${req.get(
    'host',
  )}/api/v1/user/resetPassword/${resetToken}`;
  const message = `if forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;



  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset token (valid for 10 min)',
      message
    });

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email!'
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new appError('There was an error sending the email. Try again later!'),
      500
    );
  }
});



exports.resetPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on the token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() }
  });
  //console.log(" now date :", new Date(Date.now()).toISOString());
   // if token has not expired, and we found a user => set the new password
  if (!user) {
    return next(new appError('Token is invalid or has expired', 400));
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  //bch e link fel email maadech yemchy;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  createSendToken(user, 200, res);



});



exports.updatePassword = catchAsync(async (req, res, next) => {
  if (!req.body.passwordCurrent)  return next(
    new appError('please provide your current password', 400)
  );
  if (!req.body.password || !req.body.passwordConfirm ) {
    return next(
      new appError('Please provide password and passwordConfirm', 400)
    );
  }
  // 1) Get user from collection
  const user = await User.findById(req.user.id).select('+password');

  // 2) Check if POSTed current password is correct
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new appError('Your current password you submitted is wrong.', 401));
  }
  

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();
  createSendToken(user, 200, res);

});