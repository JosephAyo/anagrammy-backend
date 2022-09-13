import dotenv from "dotenv";
import path from "path";
import childProcess from "child_process";
import util from "util";
import logger from "jet-logger";

const exec = util.promisify(childProcess.exec);

// Set the env file
const result2 = dotenv.config({
  path: path.join(__dirname, `../../.env`),
});
if (result2.error) {
  throw result2.error;
}

(async () => {
  try {
    const cmd = `pg_dump --format=c --compress=9 --no-acl --no-owner --verbose --dbname=postgresql://${process.env.DB_USERNAME}:${
      process.env.DB_PASS
    }@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME} > ${process.env.NODE_ENV}-backup-${Date.now()}.dump`;
    const { stderr, stdout } = await exec(cmd);
    if (stderr) {
      logger.warn(stderr);
    }
    if (stdout) {
      logger.warn(stdout);
    }
  } catch (error) {
    console.log("error :>> ", error);
  }
})();
