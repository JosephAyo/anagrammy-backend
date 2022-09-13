import dotenv from "dotenv";
import path from "path";
import { DataSource } from "typeorm";
// Set the env file
const result2 = dotenv.config({
  path: path.join(__dirname, `../../.env`),
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
  synchronize: false,
  logging: true,
  entities: [__dirname + "/entity/*.{js,ts}"],
  subscribers: [__dirname + "/subscriber/*.{js,ts}"],
  migrations: [__dirname + "/migration/*.{js,ts}"],
});

migrationDataSource.initialize();
