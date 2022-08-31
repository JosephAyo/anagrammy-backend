#! /usr/bin/bash
read -p "node env : " NODE_ENV
npx typeorm-ts-node-commonjs migration:revert -d ../src/database/ormconfig.ts -- --node_env=$NODE_ENV