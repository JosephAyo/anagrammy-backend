/**
 * Remove old files, copy front-end ones.
 */

import logger from "jet-logger";
import { copy, execCommand, remove } from ".";
const NODE_ENV = process.argv[2];

(async () => {
  try {
    // Remove current build
    await remove("./dist/");
    // Copy production env file
    await copy(`./src/pre-start/env/${NODE_ENV}.env`, `./dist/pre-start/env/${NODE_ENV}.env`);
    if (!["test", "development"].includes(process.env.NODE_ENV as string))
      await copy(`./src/pre-start/env/ca-certificate.cer`, `./dist/pre-start/env/ca-certificate.cer`);
    if (!["test"].includes(process.env.NODE_ENV as string)) {
      await copy(`./src/pre-start/env/AuthKey.p8`, `./dist/pre-start/env/AuthKey.p8`);
      await copy(`./src/utils/raw/logo.png`, `./dist/utils/raw/logo.png`);
      await copy(`./src/pre-start/env/serviceAccountKey.json`, `./dist/pre-start/env/serviceAccountKey.json`);
    }
    await execCommand("yarn build", "./");
  } catch (err) {
    logger.err(err);
  }
})();
