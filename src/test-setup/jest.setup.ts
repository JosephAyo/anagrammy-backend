import faker from "@withshepherd/faker";
import { AppDataSource } from "../database/data-source";
import { User } from "../database/entity/User";
import { hashString, passwordRegexPattern } from "../utils/auth";

type baseDBTableData = {
  fieldName: string;
  tableName: string;
  fieldValue: string;
};

export const testAdminUser = {
  first_name: faker.name.firstName(),
  email: faker.internet.email(),
  phone: faker.phone.phoneNumber("###########"),
  password: faker.internet.password(8, true, passwordRegexPattern),
};
export const testAdminUserTwo = {
  first_name: faker.name.firstName(),
  email: faker.unique(faker.internet.email),
  phone: faker.phone.phoneNumber("###########"),
  password: faker.internet.password(8, true, passwordRegexPattern),
};
export const globalTestUser = {
  username: faker.name.firstName(),
  email: faker.unique(faker.internet.email),
  phone: faker.phone.phoneNumber("###########"),
  password: faker.internet.password(8, true, passwordRegexPattern),
  new_password: faker.internet.password(8, true, passwordRegexPattern),
};

const password = faker.internet.password(8, true, passwordRegexPattern);

const baseDBTableNames = ["currency", "business_category", "category", "sub_category", "user", "model"];

const baseDBTableDefaultValueData: Array<baseDBTableData> = [
  { fieldName: "name", fieldValue: "naira", tableName: "currency" },
  { fieldName: "name", fieldValue: "general", tableName: "business_category" },
  { fieldName: "name", fieldValue: "general", tableName: "category" },
];

beforeAll(async () => {
  await AppDataSource.initialize();

  const adminUser = new User();
  adminUser.username = testAdminUser.first_name;
  adminUser.email = testAdminUser.email;
  adminUser.phone = testAdminUser.phone;
  adminUser.is_email_verified = true;
  adminUser.is_phone_verified = true;
  adminUser.is_verified = true;
  adminUser.password = await hashString(testAdminUser.password);
  adminUser.last_login = new Date();
  await AppDataSource.manager.save(adminUser);

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

  for (const entityData of baseDBTableDefaultValueData) {
    try {
      await deleteBaseDBNonDefaultValueRows(entityData);
    } catch (error) {
      console.log(error.name, "here");
    }
  }
  //delete user last because of foreign key constraints
  await AppDataSource.query(`DELETE FROM "user";`);

  await testConnection.destroy();
});

const deleteBaseDBNonDefaultValueRows = async (tableData: baseDBTableData): Promise<void> => {
  await AppDataSource.query(`DELETE FROM ${tableData.tableName} WHERE ${tableData.fieldName} <> '${tableData.fieldValue}';`);
};
