import dotenv from "dotenv";
import path from "path";
import { DataSource } from "typeorm";
import { readFileSync } from "fs";
// Set the env file
const result2 = dotenv.config({
  path: path.join(__dirname, `../pre-start/env/.env`),
});
if (result2.error) {
  throw result2.error;
}

export const migrationDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT as unknown as number,
  name: "migration",
  ...(!["test", "development"].includes(process.env.NODE_ENV as string) && {
    ssl: { ca: readFileSync(path.join(__dirname, `../pre-start/env/ca-certificate.cer`)).toString() },
  }),
  synchronize: false,
  logging: true,
  entities: [__dirname + "/entity/*.{js,ts}"],
  subscribers: [__dirname + "/subscriber/*.{js,ts}"],
  migrations: [__dirname + "/migration/*.{js,ts}"],
});

migrationDataSource.initialize();
