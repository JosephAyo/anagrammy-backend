/**
 * Remove old files, copy front-end ones.
 */

import logger from "jet-logger";
import { copy, execCommand, remove } from ".";

(async () => {
  try {
    // Remove current build
    await remove("./dist/");
    // Copy production env file
    await copy(`./src/pre-start/env/.env`, `./dist/src/pre-start/env/.env`);
    await execCommand("yarn build", "./");
  } catch (err) {
    logger.err(err);
  }
})();
