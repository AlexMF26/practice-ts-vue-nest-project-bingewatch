import * as Joi from 'joi';

const schema = Joi.object({
  PORT: Joi.number().required(),
  DATABASE_URL: Joi.string()
    .pattern(/^postgres:\/\/.*:.*@.*:\d.*\/.*\?schema=.*$/)
    .required(),
  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRATION_TIME: Joi.alternatives(Joi.string(), Joi.number()).required(),
  OMDB_API: Joi.string().required(),
  OMDB_apikey: Joi.string().required(),
});

export const config = {
  validationSchema: schema,
};
