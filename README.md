# IoT Application

Visualize your AWS IoT data with the IoT Application.

## Getting Started with local development

1. Install [Volta](https://docs.volta.sh/guide/getting-started).
1. Install [Node.js@18 with Volta](https://docs.volta.sh/guide/#features).
1. Install [Yarn with Volta](https://docs.volta.sh/guide/#features).
1. Install global dependencies:
   ```sh
   yarn add global nest turbo typescript
   ```
1. Install application dependencies:
   ```sh
   yarn install
   ```
1. Start development server:
   ```sh
   yarn dev
   ```
1. Log in with test user credentials in https://github.com/awslabs/iot-application/blob/main/apps/core/.cognito/db/us-west-2_h23TJjQR9.json

## Running the tests locally

Run local test command `yarn test` to test the application. The command is "batteries included" - it has everything needed to run and test the application locally.

## Environments

### Service Dependencies

The table below lists the service dependencies for different environments.

| Catagory\Environments | [Local Develoepment](#getting-started-with-local-development)                                | [Local Test](#running-the-tests-locally)                                              |
|-----------------------|----------------------------------------------------------------|-----------------------------------------------------------------------|
| Authentication        | [cognito-local](https://www.npmjs.com/package/cognito-local)   | [cognito-local](https://www.npmjs.com/package/cognito-local)          |
| App API Database      | [dynamodb-local](https://www.npmjs.com/package/dynamodb-local) | [dynamodb-local](https://www.npmjs.com/package/dynamodb-local)        |
| App API Authorization | [cognito-local](https://www.npmjs.com/package/cognito-local)   | [JWT generated from secret](./apps/core/src/testing/jwt-generator.ts) |

## Security

See [CONTRIBUTING](CONTRIBUTING.md#security-issue-notifications) for more information.

## License

This project is licensed under the Apache-2.0 License.
