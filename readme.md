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