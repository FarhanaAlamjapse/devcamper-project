const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const sendEmail = require("../utils/sendEmail");
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
  sendTokenResponse(user, 200, res);
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

  sendTokenResponse(user, 200, res);
});

//desc    Get Current looged in User
// route   GET/api/v1/auth/me
// access   private
exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    data: user,
  });
});

//desc     Forgot Password
// route   POST/api/v1/auth/forgot password
// access   public

exports.forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorResponse("There is no user with that email", 404));
  }

  // Get resetToken
  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  // Create reset url
  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/resetpassword/${resetToken}`;

  const message = `You are receiving this email because you(or someone else)has requested the reset of a password.Please make a put request to:\n\n ${resetUrl}`;

  try {
    await sendEmail({
      email: user.email,
      subject: "password reset token",
      message,
    });
    res.status(200).json({ success: true, data: "Email Sent" });
  } catch (err) {
    console.log(err);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });
    return next(new ErrorResponse("Email could not be sent", 500));
  }
  res.status(200).json({
    success: true,
    data: user,
  });
});

// Get Token from model,create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  // create token
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === "production") {
    options.secure = true;
  }

  res
    .status(statusCode)
    .cookie("token", token, options)
    .json({ success: true, token });

  // res.status(200).json({ success: true, token });
};