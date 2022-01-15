\echo 'Delete and recreate portfolio db?'
\prompt 'Return for yes or Ctrl+C to cancel > ' foo

DROP DATABASE portfolio_v3;
CREATE DATABASE portfolio_v3;
\connect portfolio_v3

\i portfolio_v3_schema.sql

\echo 'Delete and recreate portfolio_v3_test db?'
\prompt 'Return for yes or Ctrl+C to cancel > ' foo

DROP DATABASE portfolio_v3_test;
CREATE DATABASE portfolio_v3_test;
\connect portfolio_v3_test

\i portfolio_v3_schema.sql
