/**
 * Remove old files, copy front-end ones.
 */

import logger from "jet-logger";
import { copy, execCommand, remove } from ".";

(async () => {
  try {
    // Remove current build
    await remove("./dist/");
    // Copy env file
    await copy(`./.env`, `./dist/.env`);
    await execCommand("yarn build", "./");
  } catch (err) {
    logger.err(err);
  }
})();
