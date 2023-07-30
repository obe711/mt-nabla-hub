const dotenv = require('dotenv');
const path = require('path');
const Joi = require('joi');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const nablaEnvSchema = Joi.string().required().description('Nabla API Key');

module.exports = () => async (req, res, next) => {
  const { value: nablaEnvKey, error } = nablaEnvSchema.validate(process.env.NABLA_KEY);
  if (error) {
    return next(new Error(`Invalid NABLA API KEY`));
  }
  const { nabla } = req.query;

  if (nabla !== nablaEnvKey) return next(new Error('invalid nabla key'));

  return next();
};
