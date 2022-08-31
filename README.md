# ANAGRAMMY

This is the backend application for anagrammy

## Steps

## 1. Download & Install packages

```
//on local
git clone <repo-host>/anagrammy-backend
```
```
cd anagrammy-backend

nvm install

yarn install

sudo yarn global add typeorm
```

## 2. Create gitignored files.

They are:

- src/pre-start/env/[NODE_ENV].env

## 2. Transpile

```
yarn build-dist [NODE_ENV]
```

## 3. Start the application.

```
pm2 start ./dist/ecosystem.config.js -- [NODE_ENV]
```

## 4. Application management

- restart

```
pm2 restart anagrammy-backend
```

- logs

```
pm2 logs anagrammy-backend
```

## 5. Migrations
Bash scripts to generate and run/revert migration(s) are located in the bash-scripts dir

```
cd scripts
```

action | script 
---|---
 generate migration file | ```bash create-new-migration.sh```
 run migrations | ```bash run-migrations.sh```
 revert last migration | ```bash revert-migration.sh```