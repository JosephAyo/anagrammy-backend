import faker from "@withshepherd/faker";
import { AppDataSource } from "../database/data-source";
import { User } from "../database/entity/User";
import { hashString, passwordRegexPattern } from "../utils/auth";

export const globalTestUser = {
  username: faker.name.firstName(),
  email: faker.unique(faker.internet.email),
  phone: faker.phone.phoneNumber("###########"),
  password: faker.internet.password(8, true, passwordRegexPattern),
  new_password: faker.internet.password(8, true, passwordRegexPattern),
};

const password = faker.internet.password(8, true, passwordRegexPattern);

const baseDBTableNames = ["word", "user"];

beforeAll(async () => {
  await AppDataSource.initialize();

  const regularUser = new User();
  regularUser.username = globalTestUser.username;
  regularUser.email = globalTestUser.email;
  regularUser.phone = globalTestUser.phone;
  regularUser.is_email_verified = true;
  regularUser.is_phone_verified = true;
  regularUser.is_verified = true;
  regularUser.password = await hashString(password);
  regularUser.last_login = new Date();
  await AppDataSource.manager.save(regularUser);
});

afterAll(async () => {
  const testConnection = AppDataSource.manager.connection;
  const entities = testConnection.entityMetadatas;

  for (const entity of entities) {
    const repository = testConnection.getRepository(entity.name); // Get repository

    if (!baseDBTableNames.includes(entity.tableName)) {
      await repository.query(`DELETE FROM "${entity.tableName}";`);
    }
  }

  //delete user last because of foreign key constraints
  await AppDataSource.query(`DELETE FROM "user";`);

  await testConnection.destroy();
});
