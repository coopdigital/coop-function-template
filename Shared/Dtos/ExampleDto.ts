import Joi from 'joi';

export type ExampleDto = {
  Field1: string;
  Field2: number;
};

export const exampleDtoSchema = Joi.object({
  Field1: Joi.string().max(30).required(),
  Field2: Joi.number().required(),
}).required();
