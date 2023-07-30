const dotenv = require('dotenv');
const path = require('path');
const Joi = require('joi');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string().valid('production', 'development', 'test').required(),
    PORT: Joi.number().default(3000),
    MONGODB_URL: Joi.string().required().description('Mongo DB url'),
    JWT_SECRET: Joi.string().required().description('JWT secret key'),
    JWT_ACCESS_EXPIRATION_MINUTES: Joi.number().default(30).description('minutes after which access tokens expire'),
    JWT_REFRESH_EXPIRATION_DAYS: Joi.number().default(30).description('days after which refresh tokens expire'),
    JWT_RESET_PASSWORD_EXPIRATION_MINUTES: Joi.number()
      .default(10)
      .description('minutes after which reset password token expires'),
    JWT_VERIFY_EMAIL_EXPIRATION_MINUTES: Joi.number()
      .default(10)
      .description('minutes after which verify email token expires'),
    JWT_REFRESH_COOKIE: Joi.string().description('Name of refresh token cookie'),
    SMTP_HOST: Joi.string().description('server that will send the emails'),
    SMTP_PORT: Joi.number().description('port to connect to the email server'),
    SMTP_USERNAME: Joi.string().description('username for email server'),
    SMTP_PASSWORD: Joi.string().description('password for email server'),
    EMAIL_FROM: Joi.string().description('the from field in the emails sent by the app'),
    GOOGLE_CLIENT_ID: Joi.string().description('Google Client ID for Oauth2'),
    GOOGLE_CLIENT_SECRET: Joi.string().description('Google Client Secret for Oauth2'),
    APPLE_KEYID: Joi.string().description('Apple key ID for Sign In with Apple'),
    APPLE_CLIENT_ID: Joi.string().description('Apple bundle ID'),
    APPLE_TEAM_ID: Joi.string().description('Apple developer team ID'),
    APPLE_PRIVATE_KEY_FILE: Joi.string().description('File name of key file in ./.keys directory'),
    NABLA_PORT: Joi.number().default(41234),
    NABLA_KEY: Joi.string().description('Nabla API key for getting site stats'),
    NABLA_HUB_IP: Joi.string().required(),
    NABLA_PROVIDER: Joi.string().valid('digitalocean', 'aws', 'azure').required(),
    NABLA_HUB_HOSTNAME: Joi.string().description('Nabla server hostname').required(),
    NABLA_HUB_SITE_NAME: Joi.string().description('Nabla server site name').required(),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

module.exports = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  mongoose: {
    url: envVars.MONGODB_URL + (envVars.NODE_ENV === 'test' ? '-test' : ''),
    options: {

    },
  },
  jwt: {
    secret: envVars.JWT_SECRET,
    accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
    refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS,
    resetPasswordExpirationMinutes: envVars.JWT_RESET_PASSWORD_EXPIRATION_MINUTES,
    verifyEmailExpirationMinutes: envVars.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES,
    refreshCookieName: envVars.JWT_REFRESH_COOKIE,
  },
  email: {
    smtp: {
      host: envVars.SMTP_HOST,
      port: envVars.SMTP_PORT,
      auth: {
        user: envVars.SMTP_USERNAME,
        pass: envVars.SMTP_PASSWORD,
      },
    },
    from: envVars.EMAIL_FROM,
  },
  oauth: {
    google: {
      client_id: envVars.GOOGLE_CLIENT_ID,
      client_secret: envVars.GOOGLE_CLIENT_SECRET,
    },
    apple: {
      keyId: envVars.APPLE_KEYID,
      client_id: envVars.APPLE_CLIENT_ID,
      teamId: envVars.APPLE_TEAM_ID,
      key_filename: envVars.APPLE_PRIVATE_KEY_FILE,
    },
  },
  nablaPort: envVars.NABLA_PORT,
  nablaApiKey: envVars.NABLA_KEY,
  nablaHubIp: envVars.NABLA_HUB_IP,
  nablaProvider: envVars.NABLA_PROVIDER,
  nablaHostname: envVars.NABLA_HUB_HOSTNAME,
  nablaSiteName: envVars.NABLA_HUB_SITE_NAME
};
