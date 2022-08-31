#! /bin/sh

npx typeorm-ts-node-commonjs migration:run -d ../src/database/ormconfig.ts

