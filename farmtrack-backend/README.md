# FarmTrack Backend

## Overview

FarmTrack Backend is a Spring Boot application that provides RESTful APIs for managing animal movements between farms.

### Key Files and Directories

- **Dockerfile**: Instructions to build the Docker image for the backend application
- **pom.xml**: Maven configuration file with dependencies and build configurations
- **src/**: Contains the source code of the application
- **target/**: Directory for built application and artifacts

## Prerequisites

- Java 17 or higher
- Maven 3.6.0 or higher
- Docker (optional, for containerization)

## Getting Started

### Building the Project

To build the project, navigate to the `farmtrack-backend` directory and run:

```bash
./mvnw clean install -DskipTests
```

This command will:

- Compile the source code.
- Skip tests as they are dependent on the database.
- Package the application into a JAR file in the `target` directory.

### Running the Application

#### Local Execution

To run the application locally, follow these steps:

1. In [application.properties](./src/main/resources/application.properties), change this line:

```
spring.datasource.url=jdbc:postgresql://database:5432/farmtrack-db
```

to

```
spring.datasource.url=jdbc:postgresql://localhost:5432/farmtrack-db
```

2. In the same file, set the following fields with the credentials you used to start the database:

```
spring.datasource.username=YOUR_USERNAME
spring.datasource.password=YOUR_PASSWORD
```

3. IMPORTANT: Ensure the database is running on port 5432
4. Run the following command:

```
./mvnw spring-boot:run
```

The application will be accessible at `http://localhost:8080`.

#### Docker Execution

To build and run the application using Docker:

1. Build the Docker image:

```bash
docker build -t farmtrack-backend .
```

2. Run the Docker container:
   1. In [application.properties](./src/main/resources/application.properties), set the following fields with the credentials you used to start the database:

```
spring.datasource.username=YOUR_USERNAME
spring.datasource.password=YOUR_PASSWORD
```

2.  IMPORTANT: Ensure the database container is running on port 5432, with the name "database" and on the "farmtrack-network" network.
3.  Run the following command:

```
docker run --network farmtrack-network -p 8080:8080 farmtrack-backend
```

The application will be accessible [here](http://localhost:8080). But without authentication, it will show 401 exception.

### Testing

There are two unit tests located at [tests](./src/test/java/com/ncsu/farmtrackbackend/). To run these tests, follow these steps:

1. Ensure database is running.
2. In [application.properties](./src/main/resources/application.properties), change this line:

```
spring.datasource.url=jdbc:postgresql://database:5432/farmtrack-db
```

to

```
spring.datasource.url=jdbc:postgresql://localhost:5432/farmtrack-db
```

3. Run the following command:

```
./mvnw test
```

The above steps will run both the tests. The controller test verifies that the AuthController correctly generates and returns a JWT token when provided with valid user credentials, mocking the necessary dependencies and asserting the expected response. The userService test verifies its user creation functionality, ensuring it correctly handles both new user registration and attempts to create users with existing usernames, while mocking database interactions and password encoding.

## Configuration

Configuration settings are located in [application.properties](src/main/resources/application.properties). You can customize these settings as needed.

## API Documentation

API documentation is available via Swagger UI. When the application is running, access the documentation [here](http://localhost:8080/swagger-ui.html).
