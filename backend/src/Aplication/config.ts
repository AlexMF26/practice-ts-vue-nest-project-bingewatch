import * as Joi from 'joi';

const schema = Joi.object({
  PORT: Joi.number().required(),
  DATABASE_URL: Joi.string()
    .pattern(/^postgres:\/\/.*:.*@.*:\d.*\/.*\?schema=.*$/)
    .required(),
});

export const config = {
  validationSchema: schema,
};
