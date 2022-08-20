#! /usr/bin/bash
read -p "node env : " NODE_ENV

npx ts-node ../src/database/performBackup.ts -- --node_env=$NODE_ENV
npx typeorm-ts-node-commonjs migration:run -d ../src/database/ormconfig.ts -- --node_env=$NODE_ENV

