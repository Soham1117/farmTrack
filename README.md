# FarmTrack

## Introduction

This project implements a comprehensive system for tracking and managing the movement of animals between farms. It provides a user-friendly interface for visualizing and manipulating movement records, backed by a robust API and database structure.
Built by: Sohamkumar Patel (srpate27@ncsu.edu)

## Contents

1. [Project Summary](#project-summary)
2. [Authentication System](#authentication-system)
3. [Running the Project](#running-the-project)
4. [Testing](#testing)
5. [Bonus Implementations](#bonus-implementations)

## Project Summary

This system allows for the management of animal movement records between farms. It consists of three main components:

1. A PostgreSQL database for data storage
   For more details, visit [farmtrack-database](init-scripts/)
2. A Java Spring Boot REST API for backend operations
   For more details, visit [farmtrack-backend](farmtrack-backend/)
3. An Angular-based SPA for the user interface
   For more details, visit [farmtrack-frontend](farmtrack-frontend/)

## Authentication System

Both backend and frontend use JWT tokens for authentication. Any user without proper credentials cannot access data. This is showcased in the video.
The application implements role-based access.

There can be three types of users: ADMIN, USER, VIEWER.

- VIEWER can only read/see the data.
- USER can do CRUD operations on the data.
- ADMIN can do all of the above and also manage users.

Role-based access is implemented on both ends. The backend uses Spring Security and the frontend uses authentication guards.
The default username and password for each role:

1. ADMIN - username: admin password: admin123
2. USER - username: user password: user123
3. VIEWER - username: viewer password: viewer123

## Running the Project

There are two ways to run this project using docker:

1. Local Docker Container Deployment

To run the application locally using Docker, follow these steps:

1. Clone the repository
2. Navigate to the project root directory
3. Execute the following commands:

```
docker compose build
docker compose up
```

This command will initiate all required containers, including the database, API, and web client. Once started, the application will be accessible via [http://localhost:80/login](http://localhost:80/login).

The docker images are already pushed to dockerhub. Follow the below-given instructions to run the application without building.

2. Docker-hub container
   A GitHub workflow has been configured in [.github/workflows/docker-image.yml](.github/workflows/docker-image.yml). This workflow automatically builds and pushes the application to Docker Hub whenever a commit is made to the main branch. To run the app locally, follow these steps:

- In any directory, copy just [docker-compose-dockerhub.yml](./docker-compose-dockerhub.yml).
- Rename it to `docker-compose.yml`.
- Make sure the docker engine is running.
- Open terminal or cmd prompt in that directory and run the following commands:

```
docker compose pull
docker compose up
```

## Testing

Testing details are integrated within individual components. While unit tests are not demonstrated in the video, end-to-end testing using the Cypress Framework is showcased at the conclusion of the presentation.

## Bonus Implementations

### Role-based Access Control

Detailed in the [Authentication System](#authentication-system) section.

### Swagger API Documentation

The application integrates Springdoc OpenAPI to generate interactive API documentation. Once the application is running, the Swagger UI can be accessed at http://localhost:8080/swagger-ui.html. Authentication instructions are prominently displayed at the top of the Swagger UI interface.

### Monitoring Dashboard

A user action monitoring table is positioned on the right side of the application, visible across all pages. The current implementation is a frontend solution not yet integrated with the backend. This approach demonstrates a potential method for creating a monitoring dashboard, with the table capturing user interactions that can be used to generate analytics such as click density, page visitations, and user interaction patterns.
