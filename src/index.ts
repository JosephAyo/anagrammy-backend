import dotenv from "dotenv";
import path from "path";
dotenv.config({
  path: path.join(__dirname, `../.env`),
});

import server from "./server";
import { AppDataSource } from "@database/data-source";
const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log(`⚡️[server]: anagrammy backend is running at port:${port}`);
  AppDataSource.initialize()
    .then(async () => {
      console.log(" Database initialized.");
    })
    .catch((error) => console.log(error));
});
