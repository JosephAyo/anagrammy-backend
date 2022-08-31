#!/bin/bash
echo "This script drops and then creates db" 
# sudo systemctl restart postgresql

if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    sudo systemctl restart postgresql
elif [[ "$OSTYPE" == "darwin"* ]]; then
     sudo brew services restart postgresql
else
    sudo systemctl restart postgresql
fi

psql "postgresql://postgres:$1@localhost"<<EOF
UPDATE pg_database SET datallowconn = 'false' WHERE datname = 'anagrammy_dev';

SELECT pg_terminate_backend(pg_stat_activity.pid)
FROM pg_stat_activity
WHERE pg_stat_activity.datname = 'anagrammy_dev';

DROP DATABASE IF EXISTS anagrammy_dev;
CREATE DATABASE anagrammy_dev;

DROP DATABASE anagrammy_test;
CREATE DATABASE anagrammy_test;
EOF