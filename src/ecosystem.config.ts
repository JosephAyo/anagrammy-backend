import os from "os";
const HOME_DIR = os.homedir();
const NODE_ENV = process.argv[5];

module.exports = {
  apps: [
    {
      name: "anagrammy-api",
      script: `${HOME_DIR}/.nvm/versions/node/v14.18.1/bin/node`,
      args: `-r module-alias/register ./dist/src/index.js --node_env=${NODE_ENV}`,
    },
  ],
};
