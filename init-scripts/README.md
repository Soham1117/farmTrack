# PostgreSQL Database Setup for FarmTrack

## Introduction

This repository contains the database configuration and initialization scripts for a farm animal movement tracking system. The setup uses PostgreSQL 15 with automated schema creation and data import from CSV files.

## Prerequisites

- PostgreSQL (if running without docker)
- Docker
- Docker Compose
- CSV files in `data` directory

## Database ER Diagram

![Schema Diagram](../assets/ER%20Diagram.png)

### Tables

```

-- Farm Table
CREATE TABLE Farm (
premiseid VARCHAR(50) PRIMARY KEY,
total_animal INTEGER NOT NULL DEFAULT 0
);

-- Movement Table
CREATE TABLE Movement (
movement_id SERIAL PRIMARY KEY,
new_originpremid VARCHAR(50) NOT NULL REFERENCES Farm(premiseid),
new_destinationpremid VARCHAR(50) NOT NULL REFERENCES Farm(premiseid),
new_numitemsmoved INTEGER NOT NULL CHECK (new_numitemsmoved > 0),
CONSTRAINT chk_origin_destination CHECK (new_originpremid <> new_destinationpremid)
);

-- User Table
Generated by the backend. The user table is not linked to any other table as right now it is only used for access control and not ownership.
```

## Running Database locally

IMPORTANT: Start the database before starting the backend.

1. Clone the repository.
2. Install Postgres on your system.
3. Use the psql CLI tool to create the database:

```
CREATE DATABASE farmtrack-db;
\c farmtrack-db
```

4. Then, to create the tables and auto-import data, run the following command:

```
psql -U postgres -d farmtrack-db -f init-scripts/init.sql

```

## Running Database using docker

IMPORTANT: Start the database image before starting the backend image.

1. Clone the repository.
2. Navigate to the project root directory.
3. Build the Docker Image:

```
docker build -t farmtrack-database .

```

4. Run the Docker Image:

```
docker network create farmtrack-network

docker run -d --name database --network farmtrack-network -p 5432:5432 -e POSTGRES_USER="YOUR_USER" -e POSTGRES_PASSWORD="YOUR PASSWORD" -e POSTGRES_DB=farmtrack-db farmtrack-database
```
