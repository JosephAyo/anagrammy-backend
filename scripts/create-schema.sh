#!/bin/bash
echo "This script creates the db schema" 
MYDIR="$(dirname "$0")"
psql "postgresql://localhost/$1?user=postgres&password=$2"<<EOF
\i ${MYDIR}/Anagrammy.sql;
\dt;
EOF