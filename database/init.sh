#!/bin/bash
# ALTER USER kinou WITH PASSWORD 'pass';
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" --password ""$POSTGRES_PASSWORD"" <<-EOSQL
	CREATE USER kinou WITH PASSWORD 'pass';
	CREATE DATABASE postgreDB;
	GRANT ALL PRIVILEGES ON DATABASE postgreDB TO kinou;
EOSQL