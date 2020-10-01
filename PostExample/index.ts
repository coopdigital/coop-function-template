import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import ExampleService from '../Shared/Services/ExampleService';
import ExampleRepository from '../Shared/Dal/ExampleRepository';
import {
  validateExampleBody,
  validateQueryString,
} from '../Shared/Helpers/Validation';
import AppInsights from '@coop/azure/lib/AppInsights';
import { getResponseHeaders, Result } from '../Shared/Helpers/Http';
import { ExampleDto } from '../Shared/Dtos/ExampleDto';

// Create an instance of the Service(s)
const exampleService = new ExampleService(ExampleRepository);

/** Updates an Example */
const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  context.log('PostExample trigger function processed a request.');

  const { id } = req.params;
  if (!validateQueryString(context, id)) {
    return;
  }

  const { example } = req.body;
  if (!validateExampleBody(context, example)) {
    return;
  }

  const result: Result = {};

  try {
    await exampleService.update(id, example as ExampleDto);
    result.status = 200;
  } catch (error) {
    result.status = 500;
    AppInsights.trackException(error);
  } finally {
    result.headers = getResponseHeaders();
  }

  context.res = result;
};

export default httpTrigger;