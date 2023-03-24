

DROP DATABASE IF EXISTS test;
CREATE DATABASE postgreDB;
CREATE USER IF NOT EXISTS '$POSTGRES_USER'@'%' IDENTIFIED BY 'POSTGRES_PASSWORD';
GRANT ALL PRIVILEGES ON *.* TO '$POSTGRES_USER'@'%';
SET PASSWORD FOR 'root'@'$POSTGRES_HOST' = PASSWORD('POSTGRES_ROOT_PASSWORD');

FLUSH PRIVILEGES;
CREATE TABLE user (
    nickname        varchar(20),
    user_password   varchar(20),
    user_login      varchar(20)
);

CREATE TABLE score (
    win     int,
    loose   int
);