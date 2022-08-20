import { AppDataSource } from "@database/data-source";
import { User } from "@database/entity/User";
import { expectedUser, password, globalTestUser } from "@test-setup/utils/users.setup";

import { getUserByEmail, getUserByPhone, signInUser } from "./users";
import { generateUserJWT, hashString } from "./auth";

describe("Find users", () => {
  test("should be greater than 0a", async () => {
    const users = await AppDataSource.manager.find(User);
    expect(users.length).toBeGreaterThan(0);
  });
});

describe("Get user by email", () => {
  test("should not be empty", async () => {
    const user = await getUserByEmail(globalTestUser.email);
    expect(user).toMatchObject(expectedUser);
  });
});

describe("Get user by phone", () => {
  test("should not be empty", async () => {
    const user = await getUserByPhone(globalTestUser.phone);
    expect(user).toMatchObject(expectedUser);
  });
});

describe("Hash password", () => {
  test("should be return hashed password", async () => {
    const hashedPassword = await hashString(password);
    expect(hashedPassword).not.toMatch(password);
  });
});

describe("Generate JWT", () => {
  test("should be return valid token", async () => {
    const user = await getUserByEmail(globalTestUser.email);
    const token = generateUserJWT(user as User);
    expect(token).not.toBe("");
  });
});

describe("Sign in user", () => {
  test("should be return update last_login", async () => {
    const user = await getUserByEmail(globalTestUser.email);
    await signInUser(user!.id);
    const signedInUser = await getUserByEmail(globalTestUser.email);
    const difference = Math.abs(signedInUser!.last_login!.getTime() - user!.last_login!.getTime());
    expect(difference).toBeGreaterThan(1);
  });
});
