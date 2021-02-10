import { Context } from '@azure/functions';
import Joi from 'joi';

export const idSchema = Joi.string().guid();

export const validate = (
  schema: Joi.ObjectSchema | Joi.StringSchema | Joi.NumberSchema,
  request: any,
  context: Context
): boolean => {
  const { error } = schema.validate(request);

  if (error !== undefined) {
    context.res = {
      status: 400,
      body: error.message,
    };
  }

  return error === undefined;
};
