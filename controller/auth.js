const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const User = require("../models/User");

//desc    Register User
// route   POST/api/v1/auth/register
// access   Public
exports.register = asyncHandler(async (req, res, next) => {
  const { name, password, email, role } = req.body;

  // create user
  const user = await User.create({
    name,
    password,
    role,
    email,
  });

  // create token
  const token = user.getSignedJwtToken();
  res.status(200).json({ success: true, token });
});

//desc    login User
// route   POST/api/v1/auth/login
// access   Public
exports.login = asyncHandler(async (req, res, next) => {
  const { password, email } = req.body;

  // validate email and pass
  if (!email || !password) {
    return next(new ErrorResponse("please provide an email and password", 400));
  }

  // check for user
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorResponse("Invalid credentials", 401));
  }

  // check if password matches
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return next(new ErrorResponse("Invalid Credentials", 401));
  }

  // create token
  const token = user.getSignedJwtToken();

  res.status(200).json({ success: true, token });
});
