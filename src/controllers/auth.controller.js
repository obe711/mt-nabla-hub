const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const config = require('../config/config');
const ApiError = require('../utils/ApiError');
const {
  authService,
  userService,
  tokenService,
  emailService,
  cookieService,
  appleService,
  googleService,
} = require('../services');

const register = catchAsync(async (req, res) => {
  Object.assign(req.body, { authType: 'email' });
  const user = await userService.createUser(req.body);
  const tokens = await tokenService.generateAuthTokens(user);
  res.status(httpStatus.CREATED).send({ user, tokens });
});

const loginEmail = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await authService.loginUserWithEmailAndPassword(email, password);
  const tokens = await tokenService.generateAuthTokens(user);
  cookieService.setTokenCookie(res, tokens.refresh);
  res.send({ user, tokens });
});

// loginGoogle
const loginGoogle = catchAsync(async (req, res) => {
  const user = await googleService.verifyOAuthToken(req.body.token);
  const tokens = await tokenService.generateAuthTokens(user);
  cookieService.setTokenCookie(res, tokens.refresh);
  res.send({ user, tokens });
});

// loginApple
const loginApple = catchAsync(async (req, res) => {
  const { token, firstName, lastName, code } = req.body;
  const user = await appleService.verifyOAuthToken(token, firstName, lastName);
  try {
    const appleAuthTokens = await appleService.generateAppleAuthTokens(code);
    cookieService.setAppleTokenCookie(res, appleAuthTokens.refresh_token);
  } catch {
    //logger.info('Apple token cookie not set');
  }

  if (user.role !== "admin") {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Must be admin');
  }

  await tokenService.clearUserTokens(user.id);
  const tokens = await tokenService.generateAuthTokens(user);
  cookieService.setTokenCookie(res, tokens.refresh);
  //devLogService.logServerAction(user._id.toString(), req.clientIP, 'login', 'apple');
  res.send({ user: { id: user._id, neededTos: user.neededTos, role: user.role }, tokens });
});

const logout = catchAsync(async (req, res) => {
  await authService.logout(req.body.refreshToken);
  cookieService.expireTokenCookie(res);
  res.status(httpStatus.NO_CONTENT).send();
});

const refreshTokens = catchAsync(async (req, res) => {
  console.log(req.body.refreshToken, req.cookies[config.jwt.refreshCookieName])
  const { user, tokens } = await authService.refreshAuth(req.body.refreshToken || req.cookies[config.jwt.refreshCookieName]);
  cookieService.setTokenCookie(res, tokens.refresh);
  res.send({ user, tokens });
});

const forgotPassword = catchAsync(async (req, res) => {
  const resetPasswordToken = await tokenService.generateResetPasswordToken(req.body.email);
  await emailService.sendResetPasswordEmail(req.body.email, resetPasswordToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const resetPassword = catchAsync(async (req, res) => {
  await authService.resetPassword(req.query.token, req.body.password);
  res.status(httpStatus.NO_CONTENT).send();
});

const sendVerificationEmail = catchAsync(async (req, res) => {
  const verifyEmailToken = await tokenService.generateVerifyEmailToken(req.user);
  await emailService.sendVerificationEmail(req.user.email, verifyEmailToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const verifyEmail = catchAsync(async (req, res) => {
  await authService.verifyEmail(req.query.token);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  register,
  loginEmail,
  loginApple,
  loginGoogle,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  sendVerificationEmail,
  verifyEmail,
};
