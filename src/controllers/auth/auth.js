const jwt = require('jsonwebtoken');
const { promisify } = require('util');

const User = require('../../models/user');
const catchAsync = require('../../utils/catch-async');
const AppErrorHandler = require('../../utils/errors-utils');

// jwt generate
const signInToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const {
    name,
    email,
    password,
    passwordConfirm,
    passwordChangedAt,
    role,
  } = req.body;

  const user = await User.create({
    name,
    email,
    password,
    passwordConfirm,
    passwordChangedAt,
    role,
  });

  const token = signInToken(user._id);

  res.status(201).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
});

exports.signin = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppErrorHandler('Please provide email and password', 400));
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.isValidPassword(password, user.password))) {
    return next(new AppErrorHandler('Invalid email or password', 401));
  }

  const token = signInToken(user._id);

  res.status(200).json({
    status: 'success',
    token,
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  // Check for token in the headers
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer')) {
    return next(new AppErrorHandler('Please login to get access', 401));
  }

  // Verify the token
  const token = authorization.split(' ')[1];

  // jwt.verify method is using callback...
  // Convert it into promise using node util helper promisify

  const decodeToken = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET
  );

  // Check if user exists
  const user = await User.findById(decodeToken.id);

  if (!user) {
    return next(
      new AppErrorHandler('User with that token does not exists', 401)
    );
  }

  // Checks if password is updated or changed
  if (user.isPasswordChanged(decodeToken.iat)) {
    return next(new AppErrorHandler('User recently changed password', 401));
  }

  //Grant user access
  req.user = user;

  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppErrorHandler(
          'You do not have permission to perform this operation',
          403
        )
      );
    }
    next();
  };
};
