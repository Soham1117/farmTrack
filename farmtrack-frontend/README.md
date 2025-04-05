# FarmTrack Frontend

## Overview

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.2.4.

### Key Files and Directories

- **angular.json**: Configuration file for Angular CLI.
- **package.json**: Contains project dependencies and scripts.
- **src/**: Contains the source code of the application.
- **Dockerfile**: Instructions to build the Docker image for the frontend application.
- **nginx.conf**: Configuration file for Nginx.

## Prerequisites

- Node.js 18.9.1 or higher
- Angular CLI 19.2.4 or higher
- Docker (optional, for containerization)

## Getting Started

### Starting Development Server

To start a local development server, run:

```
ng serve
```

Once the server is running, open your browser and navigate to [http://localhost:4200/](http://localhost:4200/). The application will automatically reload whenever you modify any of the source files.

### Building the project

To build the project, run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

### Running the Application

1. To run the application locally, run this command:

```
cd farmtrack-frontend
npm install
ng build
ng serve
```

2. To build and run the application using Docker:

- Build the Docker image:

  ```bash
  cd farmtrack-frontend
  docker build -t farmtrack-frontend .
  ```

- Run the Docker container:

  ```bash
  cd farmtrack-frontend
  docker run -p 80:80 farmtrack-frontend
  ```

The application will be accessible [here](http://localhost:80).

## Running Unit Tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
cd farmtrack-frontend
ng test
```

Angular associates unit tests with all its services and components. But, I have added two more unit tests: The first unit test verifies the LoginComponent's behavior by mocking dependencies and testing both successful and failed login scenarios, ensuring proper interaction with the AuthService, form handling, navigation, and error state management. The second unit test verifies the FarmListComponent's initialization behavior, including successful farm loading and error handling, by mocking the FarmService and testing the component's interaction with it.

## Running End-to-End Tests

For end-to-end (e2e) testing using Cypress Framework, run:

```bash
cd farmtrack-frontend
npx cypress open
```

Navigate to end to end testing and click [e2e-flow.cy.ts](./cypress/e2e/e2e-flow.cy.ts). The e2e test covers all the main functionalities and is using admin account.
