import { DataSource } from "typeorm";
import { readFileSync } from "fs";
import path from "path";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT as unknown as number,
  name: "default",
  ...(!["test", "development"].includes(process.env.NODE_ENV as string) && {
    ssl: { ca: readFileSync(path.join(__dirname, `../pre-start/env/ca-certificate.cer`)).toString() },
  }),
  synchronize: false,
  logging: process.env.NODE_ENV == "development",
  entities: [__dirname + "/entity/*.{js,ts}"],
  subscribers: [__dirname + "/subscriber/*.{js,ts}"],
  migrations: [__dirname + "/migration/*.{js,ts}"],
});
