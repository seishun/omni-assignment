DROP DATABASE IF EXISTS config;
CREATE DATABASE config;

\c config;

CREATE TABLE configs (
  ID SERIAL PRIMARY KEY,
  client VARCHAR,
  version VARCHAR,
  key VARCHAR,
  value VARCHAR
);
