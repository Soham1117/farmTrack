-- Create Farm Table
CREATE TABLE Farm (
    premiseid VARCHAR(50) PRIMARY KEY,
    total_animal INTEGER NOT NULL DEFAULT 0
);

-- Create Movement Table
CREATE TABLE Movement (
    movement_id SERIAL PRIMARY KEY,
    new_originpremid VARCHAR(50) NOT NULL REFERENCES Farm(premiseid),
    new_destinationpremid VARCHAR(50) NOT NULL REFERENCES Farm(premiseid),
    new_numitemsmoved INTEGER NOT NULL CHECK (new_numitemsmoved > 0),
    CONSTRAINT chk_origin_destination CHECK (new_originpremid <> new_destinationpremid)
);


-- Importing farm data
CREATE TEMPORARY TABLE temp_farm_import (
    id INTEGER,
    premiseid VARCHAR(50),
    total_animal INTEGER
);

COPY temp_farm_import FROM '/docker-entrypoint-initdb.d/population.csv' WITH (
    FORMAT csv,
    HEADER true,
    DELIMITER ',',
    FORCE_NULL (premiseid)
);

INSERT INTO Farm (premiseid, total_animal)
SELECT 
    premiseid,
    total_animal
FROM temp_farm_import;

DROP TABLE temp_farm_import;

-- Importing movement data
CREATE TEMPORARY TABLE temp_import (
    account VARCHAR(100),
    company VARCHAR(100),
    movementreason VARCHAR(100),
    species VARCHAR(100),
    originaddress VARCHAR(255),
    origincity VARCHAR(100),
    originname VARCHAR(100),
    originpostalcode VARCHAR(20),
    originpremid VARCHAR(50),
    originstate VARCHAR(2),
    destinationaddress VARCHAR(255),
    destinationcity VARCHAR(100),
    destinationname VARCHAR(100),
    destinationpostalcode VARCHAR(20),
    destinationpremid VARCHAR(50),
    destinationstate VARCHAR(2),
    origin_lat NUMERIC,
    origin_lon NUMERIC,
    destination_lat NUMERIC,
    destination_long NUMERIC,
    numitemsmoved INTEGER,
    shipmentsstartdate VARCHAR(50)
);

COPY temp_import FROM '/docker-entrypoint-initdb.d/movement.csv' WITH (FORMAT csv, HEADER true);

INSERT INTO Movement (new_originpremid, new_destinationpremid, new_numitemsmoved)
SELECT 
    originpremid,
    destinationpremid,
    numitemsmoved
FROM temp_import;

DROP TABLE temp_import;
