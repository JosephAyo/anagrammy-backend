#! /usr/bin/bash
read -p "migration name: " MIGRATION_NAME
echo $MIGRATION_NAME
typeorm migration:create ../src/database/migration/$MIGRATION_NAME