import { Context } from '@azure/functions';
import { instanceOfExampleDto } from '../Dtos/ExampleDto';

/** Validates the query string to check that Id is a valid Guid */
export const validateQueryString = (context: Context, id: string): boolean => {
  let result = true;

  const isValidId = /^(\{{0,1}([0-9a-fA-F]){8}-([0-9a-fA-F]){4}-([0-9a-fA-F]){4}-([0-9a-fA-F]){4}-([0-9a-fA-F]){12}\}{0,1})$/.test(
    id
  );
  if (!isValidId) {
    result = false;
    context.res = {
      status: 400,
      body: 'Please provide a valid GUID Id',
    };
  }

  return result;
};

/** Checks the Body to ensure that it is valid */
export const validateExampleBody = (
  context: Context,
  example: any
): boolean => {
  let result = true;

  // Checks the example matches the body
  if (!instanceOfExampleDto(example)) {
    result = false;
    context.res = {
      status: 400,
      body: 'Please provide a valid Example in the Body',
    };
  }

  // Add additional validation for individual fields.

  return result;
};
