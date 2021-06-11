import 'reflect-metadata';
import { Container } from 'typedi';
import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import ExampleService from '../Shared/Services/ExampleService';
import { validate, idSchema } from '../Shared/Helpers/Validation';
import AppInsights from '@coop/azure/lib/AppInsights';
import { getResponseHeaders, Result } from '../Shared/Helpers/Http';

// Create an instance of the Service(s)
const exampleService = Container.get(ExampleService);

/** Gets an Example */
const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  context.log('GetExample trigger function processed a request.');

  const { id } = req.params;
  if (!validate(idSchema, id, context)) {
    return;
  }

  const result: Result = {};

  try {
    const example = await exampleService.get(id);

    if (example) {
      result.body = example;
      result.status = 200;
    } else {
      result.status = 404;
    }
  } catch (error) {
    result.status = 500;
    AppInsights.trackException(error);
  } finally {
    result.headers = getResponseHeaders();
  }

  context.res = result;
};

export default httpTrigger;
