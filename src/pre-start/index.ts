/**
 * Pre-start is where we want to place things that must run BEFORE the express server is started.
 * This is useful for environment variables, command-line arguments, and cron-jobs.
 */

import path from "path";
import dotenv from "dotenv";
import commandLineArgs from "command-line-args";

interface ICommandLineOptions {
  node_env: string;
  watch_changes: string;
}
(() => {
  // Setup command line options
  const options = commandLineArgs([
    {
      name: "node_env",
      alias: "e",
      defaultValue: "development",
      type: String
    },
    {
      name: "watch_changes",
      alias: "w",
      type: Boolean
    }
  ]) as ICommandLineOptions;

  // Set the env file
  const result2 = dotenv.config({
    path: path.join(__dirname, `env/${options.node_env}.env`)
  });
  if (result2.error) {
    throw result2.error;
  }
})();
