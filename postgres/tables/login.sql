BEGIN TRANSACTION;

CREATE TABLE login (
  id serial NOT NULL PRIMARY KEY,
  hash VARCHAR(100) NOT NULL,
  email text UNIQUE NOT NULL
);

COMMIT;
