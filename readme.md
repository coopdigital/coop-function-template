# Coop Retail IT Azure Functions TypeScript Starter

## Overview

This project is a starter template for Azure Function TypeScript applications.

The aim of the template is to help guide a common approach, making it easier to get building quicker and to ensure that each app meets the required development standards.

## Getting Started

1. Clone this repo to a new folder for your project

```
git clone https://co-operative@dev.azure.com/co-operative/Store%20Futures/_git/coop_function_boilerplate <NEW_PROJECT_NAME>
```

2. Update the `git origin` to be the repo of your new project

```
git remote set-url origin <NEW_GIT_URL>
```

3. Use `npm` to install the project dependences

```
npm install
```

> **Check for any new security vulnerabilities**
>
> ```
> npm audit --registry=https://registry.npmjs.org/ 
> ```
>
> For issues cause by outdated packages run `npm audit fix` to resolve the issues.
>
> To ensure that the template stays up to date please submit `Pull` requests when security issue are found.

### Set the project name in the following locations

- `public/index.html` - `<meta name="description">` and `<title>`
- `public/manifest.json` - `short_name` and `name`
- `package.json` - `name`

## TypeScript

`TypeScript` is a typed superset of JavaScript. The introduction of types makes it easier to catch errors early and offers improve intellisense.

See [here](https://www.typescriptlang.org/docs/home.html) for a starter guide.

See the [UCP Docs](https://cpdocs.azurewebsites.net/#/developer/coding-standards?id=typescript) for the TypeScript naming standards.

## Debugging

Press `F5` to start debugging the function. To debug failing test use the `Jest` VSCode extension.

## Tests

It is important to add unit tests for you app.

> You should aim to have a code coverage of at least **80%**.

Run the command `npm run test` to start the test runner. This will monitor file changes and automatically run the tests as you dev.

Alternatively the following command `npm run test:ci` will run the tests and generate coverage reports in the `/test` folder.

If you have installed the [Coverage Gutters](https://marketplace.visualstudio.com/items?itemName=ryanluker.vscode-coverage-gutters) extension, select the `Watch` button in the status bar to display coverage in the editor.

## Build

In the root of the project there is an `azure-pipelines.yml` file. Use this file to setup a new Build Pipeline in Azure DevOps. The build includes Unit Tests, Code Coverage and WhiteBolt Open Source Scanner.

## `Shared` Folder

The following structure should be used:

- Shared
  - Dal - Data Access Layer. Create `Repository` classes for accessing the Database.
  - Dtos - Data Transfer Objects - Define TypeScript Types that are used for the API requests and responses.
  - Helpers - Shared `Helper` functions.
  - Models - Define TypeScript Types for the Data Models
  - Service - Create `Service` classes that abstact business logic away from the functions.





# High-Level Architecture

![Micro-Service.png](/Architecture.png)

## Azure Stack

| Azure Service                                  | Description                                                                                                                                                                                                                                                               | Example Usage                     |
| ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------- |
| App Insights                                   | `Analytics` (inc users, sessions and funnels) and `Application Performance Monitoring` (inc performance, availability and connection issues)                                                                                                                              | Availability API     |
| Azure Active Directory                         | Used to provided `service to service` authentication using the `OAuth` standard                                                                                                                                                                                           | UCP   |
| Cosmo DB                                       | Azures NoSQL database                                                                                                                                                                                                                                                     | Availability API           |
| DevOps (User Stories, Git Repos and Pipelines) | Services to support DevOps, includes `Azure Boards` for User Stories, Kanban and Sprint Planning, `Azure Repos` for Git source control and code reviews, `Azure Pipelines` for CI/CD, `Azure Test Plans` for test management and `Azure Artifacts` for package management | Pay in Aisle, Boris, OIS and Fuel |
| Function App                                   | Serverless functions in Azure                                                                                                                                                                                                                                             | Pay in Aisle and Boris            |
| Service Bus                                        | Provides highly reliable cloud messaging between applications and services even when they’re offline | Part of the Coop integration pub-sub strategic pattern                     |

## Technology Stack

### Frameworks

| Name                  | Description                                                                | Example Usage                                                         |
| --------------------- | -------------------------------------------------------------------------- | ------------------------------------------------------------- |
| Node.js               | A javascript runtime for server development                                | Availability API |
| Azure Functions | Microsoft Node.js library for Azure Functions | Availability API|
| Jest | A Javascript testing |
| Eslint and Prettier | Automated code formatting |

### Languages

| Language   | Description                                                                          | Example Usage                                                         |
| ---------- | ------------------------------------------------------------------------------------ | ------------------------------------------------------------- |
| TypeScript | JavaScript Superset Scripting language for Web development                                               | Availability API |


# Code Structure

> Template Project - https://dev.azure.com/co-operative/Store%20Futures/_git/coop_function_boilerplate

![API Code Layers.png](/ApiTiers.png)

## Function Triggers

These are the HTTP Rest entry points into the API. There should be an Function Trigger for each Method and Action. Each function trigger should validate the inputs and return a *400* response code if they are not valid.

### Naming

HTTP Function triggers should be name `<Action><Description>`, ie `GetAvaiabilityByStore`.

### Path
The URI foreach trigger is configured via the **route** property in the `function.json`. See the [API standards](https://teams.microsoft.com/l/file/6005FEB7-F2D9-4E49-889A-9E4E4F2DEE8F?tenantId=834fb7b4-624d-4de8-a977-2d46ad979bd9&fileType=docx&objectUrl=https%3A%2F%2Fcooponline.sharepoint.com%2Fsites%2FIntegration-Private%2FShared%20Documents%2FAPI%20Principles%20and%20Standards%2FAPI%20Principles%20%26%20Standards%20v2_Draft%20(2).docx&baseUrl=https%3A%2F%2Fcooponline.sharepoint.com%2Fsites%2FIntegration-Private&serviceName=teams&threadId=19%3A3c3e3952805b460e81c10cef195f19fb%40thread.skype&groupId=3d06c6e3-4046-443d-af18-e5cedd7f7936) for URI naming conventions.

```json
{
  "bindings": [
    {
      "authLevel": "anonymous",
      "type": "httpTrigger",
      "direction": "in",
      "name": "req",
      "route": "stores/{store}/products/{barcode}",
      "methods": [
        "get"
      ]
    },
    {
      "type": "http",
      "direction": "out",
      "name": "res"
    }
  ],
  "scriptFile": "../dist/GetAvailabilityTrigger/index.js"
}
```

### Example

```typescript
import 'reflect-metadata';
import { Container } from 'typedi';
import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import ExampleService from '../Shared/Services/ExampleService';
import { validate, idSchema } from '../Shared/Helpers/Validation';
import AppInsights from '@coop/azure/lib/AppInsights';
import { getResponseHeaders, Result } from '../Shared/Helpers/Http';
import { ExampleDto, exampleDtoSchema } from '../Shared/Dtos/ExampleDto';

// Create an instance of the Service(s)
const exampleService = Container.get(ExampleService);

/** Updates an Example */
const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  context.log('PostExample trigger function processed a request.');

  const { id } = req.params;
  if (!validate(idSchema, id, context)) {
    return;
  }

  const { example } = req.body;
  if (!validate(exampleDtoSchema, example, context)) {
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
```

## Services - Business Logic

Abstracts the Business logic away from the function triggers so that it can re-used and tested in isolation. Should map data models to DTOs.

### Naming and Path

Services should be stored in the `shared\services\` folder. The service name should be in the format `<Domain>Service`, ie `AvailabiltyService`.

### Example

```typescript
import { Service } from 'typedi';
import ExampleRepository from '../Dal/ExampleRepository';
import { ExampleDto } from '../Dtos/ExampleDto';
import { ExampleModel } from '../Models/ExampleModel';

/** Example Service, abstract business logic from the Function */
@Service()
export default class ExampleService {
  /** Initialises the Service */
  constructor(private exampleRepository: ExampleRepository) {}

  /** Gets a example record by id */
  public async get(id: string): Promise<ExampleDto> {
    let response: ExampleDto = null;

    const exampleData = await this.exampleRepository.getExampleById(id);

    if (exampleData) {
      response = {
        Field1: exampleData.Field1,
        Field2: exampleData.Field2,
      };
    }

    return response;
  }

  /** Updates an example */
  public async update(id: string, example: ExampleDto): Promise<void> {
    const exampleModel: ExampleModel = { id, ...example };

    await this.exampleRepository.updateExampleModel(exampleModel);
  }
}

```

## Data Access Layer

Abstracts databases access and apis from the business logic in the *Services*. To reduce outbound connections all data access layers should use a single instance.

### Naming and Path

Data access layers should be stored in the `shared\dals\` folder. The service name should be in the format `<Domain>Service`, ie `AvailabiltyService`.

### Example

```typescript
import { Container, CosmosClient } from '@azure/cosmos';
import { Service } from 'typedi';
import AppInsights from '@coop/azure/lib/AppInsights';
import { ExampleModel } from '../Models/ExampleModel';

/** Example Cosmos DB Repository */
@Service()
export default class ExampleRepository {
  /** The cosmosClient, this connection should be maintained across instances */
  private cosmosClient: CosmosClient;
  /** The **Database** container */
  private container: Container;

  /** Initialises the *Cosmos DB* and gets the **database** and **container** */
  constructor() {
    this.cosmosClient = new CosmosClient({
      endpoint: process.env.cosmos_endpoint,
      key: process.env.cosmos_key,
    });

    this.container = this.cosmosClient
      .database(process.env.cosmos_database)
      .container(process.env.cosmos_container);
  }

  /** Gets an exampleModel by Id */
  async getExampleById(id: string): Promise<ExampleModel> {
    let exampleModel: any = null;

    // Get product by ID, second field is the partition key, in this
    // example Id but generally wouldn't be ID.
    const { resource: data } = await this.container.item(id, id).read();

    if (data) {
      exampleModel = data as ExampleModel;
    }

    return exampleModel;
  }

  /** Finds records by **Field 1** */
  async find(field1: string): Promise<Array<ExampleModel>> {
    // Use the Parameters to protect against SQL Injection attacks
    const querySpec = {
      query: 'SELECT * FROM p WHERE p.Field1 = @field1',
      parameters: [{ name: '@field1', value: field1 }],
    };

    const { resources: data } = await this.container.items
      .query(querySpec)
      .fetchAll();

    return data.map((record) => {
      return record as ExampleModel;
    });
  }

  /** Updates the exampleModel record in the DB */
  async updateExampleModel(exampleModel: ExampleModel): Promise<void> {
    await this.container.items.upsert(exampleModel);
  }
}
```

# Authentication - Azure AD

The Co-op Azure Active Directory can be used to provided OAuth authentication for APIs. **All** APIs should required Authentication, unless they have been signed-off as a Public API.

## Incoming

To allow a system access to an API secured by OAuth:
- Create a unique service principal for the Client - This can be provied by the Cloud Team.
- Securely share the Client ID and Secret with the client via Key Vault.

### Getting a Token

The client should use the Client ID and Secret to get a token:

```curl
curl --location --request POST 'https://login.microsoftonline.com/coop.co.uk/oauth2/token' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--form 'grant_type=client_credentials' \
--form 'client_id=<REPLACE_WITH_YOU_CLIENT_ID>' \
--form 'resource=https://<REPLACE_WITH_RESOURCE_NAME>.azurewebsites.net' \
--form 'client_secret=<REPLACE_WITH_YOU_CLIENT_SECRET>' \
--form 'scope=https://coop.co.uk/<REPLACE_WITH_RESOURCE_AD_NAME>'
```

### Call the API

```curl 
curl --location --request POST '<REPLACE_WITH_RESOURCE_URL>' \
--header 'Authorization: Bearer <REPLACE_WITH_TOKEN>' \
--header 'Content-Type: application/json' \
--data-raw '{"query":"query {\n    product(barcode:\"7613034065520\"){\n        descriptions {\n            product\n            full\n        }\n    }\n}","variables":{}}'
```

## Outgoing

Managed Identities should be used to access APIs and Service in Co-op Azure subscriptions.

To enable managed identities the API needs to be assigned a `System Identity`. This should be done via the infrastructure Terraform.

The API Identity then needs to be given access to requried resources via the `Access Contol (IAM)`. This should be done via the infrastructure Terraform.

### Example Code

Once managed identities have been enabled the function app provides a local endpoint for retreiveing the OAuth token. The environment variables **MSI_ENDPOINT** and **MSI_SECRET** are injected by the function.

```typescript
import axios, { AxiosRequestConfig } from 'axios';
import AppInsights from '@coop/azure/lib/AppInsights';

export default async function getToken() {
  const config: AxiosRequestConfig = {
    method: 'GET',
    baseURL: process.env.MSI_ENDPOINT,
    url: `/?resource=https://rt-1-dv-euw-gateway-app-01.azurewebsites.net&api-version=2017-09-01`,
    headers: {
      Secret: process.env.MSI_SECRET
    }
  };

  let response = await axios.request(config);

  return response.data.access_token;
}
```

### External APIs

Secrets for external APIs should be hosted in an Azure Key Vault.

# Logging and Analytics

Use the App Insights for logging exceptions, custom events and tracing information.

There is a helper function in `@coop/azure` to make it easier to add this logging to your application.

## Example

```typescript
import AppInsights from '@coop/azure/lib/AppInsights';

AppInsights.trackException(`Error - ${error}`);

AppInsights.trackEvent('Custom Event', { CustomProperty1: 'Value' });
``` 

# Testing

It's is vital for each API to include a comprehensive automated test suite. This gives us confidence that our code works allowing us to deploy it quickly and safely.

We use **Jest** as our test framework.

The command `npm test` runs **Jest** in watch mode which will constantly monitor code and rerun the tests as you make changes.

![image.png](/JestTests.png)

The command `npm run test:ci` runs Jest and generates a coverage report that drives the Coverage Gutters.

![image.png](/CoverageGutters.png)

## Unit Tests

A Unit test should test a single function or class in isolation. Dependencies should be mocked and alternate flows should each be tested separately.

### Examples

#### Basic Test

```typescript
export const DivideBy = (dividend: number, divisor: number): number => {
  if (divisor === 0) {
    throw new Error('Cannot divide by 0');
  }

  return dividend / divisor;
};
```

```typescript
import { DivideBy } from './index';

describe('DivideBy', () => {
  it('DivideBy - Success', () => {
    expect(DivideBy(100, 2)).toBe(50);
    expect(DivideBy(5, 4)).toBe(1.25);
    expect(DivideBy(0.1, 8)).toBe(0.0125);
  });

  it('DivideBy - Exception', () => {
    expect(() => DivideBy(90, 0)).toThrowError('Cannot divide by 0');
  });
});
```

#### Mock Dependency

```typescript
import { GetProduct } from './product';

export const GetProductName = (barcode: string): string => {
  let name = '';

  const product = GetProduct(barcode);

  if (product !== null) name = `${product.description} ${product.weight}`;

  return name;
};
```

```typescript
import { GetProduct } from './product';
jest.mock('./product');

describe('getProductName', () => {
  it('getProductName - Success', () => {
    // Arrange
    (GetProduct as jest.Mock).mockImplementation(() => {
      return { description: 'Test Product', weight: '123g' };
    });

    // Act
    const response = GetProductName('123456789');

    // Assert
    expect(response).toBe('Test Product 123g');
  });

  it('getProductName - Exception', () => {
    // Arrange
    (GetProduct as jest.Mock).mockImplementation(() => {
      return null;
    });

    // Act
    const response = GetProductName('123456789');

    // Assert
    expect(response).toBe('');
  });
});

```

## Integration Tests

The aim of the integration tests is to validate that the API works end-to-end including the database.

When the integration tests run it:
1. Starts an instance of the API using the function core tools.
2. Runs the integrations tests, which action the API using Axios commands 
3. Kills the instance of the API

```typescript
import { ChildProcess, exec } from 'child_process';
import axios, { AxiosRequestConfig } from 'axios';
import find from 'find-process';

describe('Integration Tests', () => {
  let func: ChildProcess;

  beforeAll(async () => {
    func = exec('npx func start', (error, stdout, stderr) => {
      if (error) {
        console.log(error.stack);
        console.log('Error code: ' + error.code);
        console.log('Signal received: ' + error.signal);
      }
      console.log('Child Process STDOUT: ' + stdout);
      console.log('Child Process STDERR: ' + stderr);
    });

    return sleep(10000);
  });

  afterAll(async () => {
    const processesList = await find('name', 'func.exe');

    if (processesList.length > 0) {
      process.kill(processesList[0].pid);
    }
  });

  it('Example Test - Success', async () => {
    const config: AxiosRequestConfig = {
      method: 'GET',
      baseURL: 'http://localhost:7071',
      url: '/api/example/Barry',
    };

    let response = await axios.request(config);

    expect(response.data).toBe(
      'Hello, Barry. This HTTP triggered function executed successfully.'
    );
  });

  it('Example Test - Failure', async () => {
    const config: AxiosRequestConfig = {
      method: 'GET',
      baseURL: 'http://localhost:7071',
      url: '/api/example',
    };

    let responseCode;

    try {
      let response = await axios.request(config);
    } catch (error) {
      responseCode = error.response.status;
    }

    expect(responseCode).toBe(404);
  });
});

function sleep(duration) {
  return new Promise(function (resolve, reject) {
    setTimeout(() => {
      resolve(0);
    }, duration);
  });
}
```

# Build Pipelines

The function app template contains the `azure-pipelines.yml` which should be used to configure the automated build.

This will 
 - Build and test your API. 
 - Scan it for *open source* security vulnerabilities. 
 - Prune development dependencies from the production release.
 - Publish the build artefacts.

```yml
# Node.js
# Build a general Node.js project with npm.
# Add steps that analyze code, save build artifacts, deploy, and more:
# https://docs.microsoft.com/azure/devops/pipelines/languages/javascript

trigger:
  - master

pool:
  vmImage: 'ubuntu-latest'

steps:
  - task: NodeTool@0
    inputs:
      versionSpec: '10.x'
    displayName: 'Install Node.js'

  - task: Npm@1
    displayName: 'Install Application Dependencies'
    inputs:
      command: install
      workingDir: '$(System.DefaultWorkingDirectory)'
      verbose: false

  - task: WhiteSource Bolt@20
    displayName: 'WhiteSOurce Bolt'

  - task: Npm@1
    inputs:
      command: 'custom'
      workingDir: '$(System.DefaultWorkingDirectory)'
      customCommand: 'run build --if-present'
    displayName: 'Run build script'

  - task: Npm@1
    inputs:
      command: 'custom'
      customCommand: 'run test:ci'
    displayName: 'Run Unit Tests'

  - task: PublishTestResults@2
    displayName: 'Publish Test Results junit.xml'
    inputs:
      testResultsFiles: junit.xml
      searchFolder: '$(System.DefaultWorkingDirectory)/testing'
    condition: succeededOrFailed()

  - task: PublishCodeCoverageResults@1
    displayName: 'Publish code coverage from  $(System.DefaultWorkingDirectory)/testing/coverage/cobertura-coverage.xml'
    inputs:
      codeCoverageTool: Cobertura
      summaryFileLocation: ' $(System.DefaultWorkingDirectory)/testing/coverage/cobertura-coverage.xml'

  - task: Npm@1
    displayName: 'Remove extraneous packages'
    inputs:
      command: custom
      workingDir: '$(System.DefaultWorkingDirectory)'
      verbose: false
      customCommand: 'prune --production'

  - task: ArchiveFiles@2
    displayName: 'Archive files'
    inputs:
      rootFolderOrFile: '$(System.DefaultWorkingDirectory)'
      includeRootFolder: false

  - task: PublishBuildArtifacts@1
    displayName: 'Publish Artifact: drop'
```

# Infrastructure and Terraform

## Size and Scaling

## API Gateways

## WAF

## vNet

## Whitelisting