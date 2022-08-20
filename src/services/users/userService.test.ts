import request from "supertest";
import { Express } from "express-serve-static-core";
import app from "@server";
import { IErrorResponseDto, ISuccessResponseDto } from "@utils/responses";
import { getUserByEmail } from "@utils/users";
import { generateUserJWT } from "@utils/auth";
import { User } from "@database/entity/User";
import {
  URI_BASE,
  global,
  signBackDatedJWT,
  signUpUser,
  updatedTestUser,
  invalidTestUser,
  signUpUserNoLastName,
} from "@test-setup/services/userService.setup";
import { randomInvalidId } from "@test-setup/utils/common.setup";
import { AppDataSource } from "@database/data-source";

let server: Express;

beforeAll(async () => {
  server = app;

  // await AppDataSource.initialize();
});

describe("Sign up endpoint", () => {
  test("Invalid input, should have error and return code 500", async () => {
    const res = await request(server).post(`${URI_BASE}/sign-up`);
    const response: IErrorResponseDto = JSON.parse(res.text);
    expect(response.hasError).toBe(true);
    expect(response.errors.code).toEqual(500);
  });

  test("Valid input, should not have error return code 201", async () => {
    const res = await request(server).post(`${URI_BASE}/sign-up`).send(signUpUser).set("Accept", "application/json");
    const response: ISuccessResponseDto = JSON.parse(res.text);
    expect(response.hasError).toBe(false);
    expect(response.code).toEqual(201);
  });

  test("Valid input no last name, should not have error return code 201", async () => {
    const res = await request(server).post(`${URI_BASE}/sign-up`).send(signUpUserNoLastName).set("Accept", "application/json");
    const response: ISuccessResponseDto = JSON.parse(res.text);
    expect(response.hasError).toBe(false);
    expect(response.code).toEqual(201);
  });

  test("Valid input for existing user, should have error return code 500", async () => {
    const res = await request(server).post(`${URI_BASE}/sign-up`).send(signUpUser).set("Accept", "application/json");
    const response: IErrorResponseDto = JSON.parse(res.text);
    expect(response.hasError).toBe(true);
    expect(response.errors.code).toEqual(500);
  });
});

describe("Sign in endpoint", () => {
  test("Invalid input, should have error and return code 500", async () => {
    const res = await request(server).post(`${URI_BASE}/sign-in`);
    const response: IErrorResponseDto = JSON.parse(res.text);
    expect(response.hasError).toBe(true);
    expect(response.errors.code).toEqual(500);
  });

  test("Incorrect email, should have error and should return code 401", async () => {
    const res = await request(server)
      .post(`${URI_BASE}/sign-in`)
      .send({
        email: invalidTestUser.email,
        password: signUpUser.password,
      })
      .set("Accept", "application/json");
    const response: IErrorResponseDto = JSON.parse(res.text);
    expect(response.hasError).toBe(true);
    expect(response.errors.code).toEqual(401);
  });

  test("Incorrect password, should have error and should return code 401", async () => {
    const res = await request(server)
      .post(`${URI_BASE}/sign-in`)
      .send({
        email: signUpUser.email,
        password: invalidTestUser.password,
      })
      .set("Accept", "application/json");
    const response: IErrorResponseDto = JSON.parse(res.text);
    expect(response.hasError).toBe(true);
    expect(response.errors.code).toEqual(401);
  });

  test("Correct credentials, should not have error and should return code 200", async () => {
    const res = await request(server)
      .post(`${URI_BASE}/sign-in`)
      .send({
        email: signUpUser.email,
        password: signUpUser.password,
      })
      .set("Accept", "application/json");
    const response: ISuccessResponseDto = JSON.parse(res.text);
    expect(response.hasError).toBe(false);
    expect(response.code).toEqual(200);
  });
});

describe("View profile endpoint", () => {
  describe("Invalid profile", () => {
    beforeAll(() => {
      global.invalidToken = generateUserJWT(invalidTestUser as User);
      global.expiredToken = generateUserJWT(invalidTestUser as User);
    });

    test("No auth header, should have error and return code 401", async () => {
      const res = await request(server).get(`${URI_BASE}/profile/view`);
      const response: IErrorResponseDto = JSON.parse(res.text);
      expect(response.hasError).toBe(true);
      expect(response.errors.code).toEqual(401);
    });

    test("No token, should have error and return code 401", async () => {
      const res = await request(server).get(`${URI_BASE}/profile/view`).set("Authorization", "Bearer ");
      const response: IErrorResponseDto = JSON.parse(res.text);
      expect(response.hasError).toBe(true);
      expect(response.errors.code).toEqual(401);
    });

    test("Invalid token, should have error and return code 401", async () => {
      const res = await request(server)
        .get(`${URI_BASE}/profile/view`)
        .set("Authorization", "Bearer " + global.invalidToken!);
      const response: IErrorResponseDto = JSON.parse(res.text);
      expect(response.hasError).toBe(true);
      expect(response.errors.code).toEqual(401);
    });
  });

  describe("Valid profile endpoint", () => {
    beforeAll(async () => {
      global.validToken = generateUserJWT((await getUserByEmail(signUpUser.email)) as User);
      global.expiredToken = signBackDatedJWT((await getUserByEmail(signUpUser.email)) as User);
    });

    test("Expired token, should have error and return code 401", async () => {
      const res = await request(server)
        .get(`${URI_BASE}/profile/view`)
        .set("Accept", "application/json")
        .set("Authorization", "Bearer " + global.expiredToken);

      const response: IErrorResponseDto = JSON.parse(res.text);
      expect(response.hasError).toBe(true);
      expect(response.errors.code).toEqual(401);
    });

    test("Valid token, should not have error return code 200", async () => {
      const res = await request(server)
        .get(`${URI_BASE}/profile/view`)
        .set("Accept", "application/json")
        .set("Authorization", "Bearer " + global.validToken);
      const response: ISuccessResponseDto = JSON.parse(res.text);
      expect(response.hasError).toBe(false);
      expect(response.code).toEqual(200);
    });
  });
});

describe("Account verification endpoints", () => {
  describe("Resend verification", () => {
    test("Incorrect email, should have error and return code 401", async () => {
      const res = await request(server)
        .post(`${URI_BASE}/resend-verification/email`)
        .send({
          email: invalidTestUser.email,
        })
        .set("Accept", "application/json");
      const response: IErrorResponseDto = JSON.parse(res.text);
      expect(response.hasError).toBe(true);
      expect(response.errors.code).toEqual(401);
    });

    test("Incorrect phone, should have error and return code 401", async () => {
      const res = await request(server)
        .post(`${URI_BASE}/resend-verification/phone`)
        .send({
          phone: invalidTestUser.phone,
        })
        .set("Accept", "application/json");
      const response: IErrorResponseDto = JSON.parse(res.text);
      expect(response.hasError).toBe(true);
      expect(response.errors.code).toEqual(401);
    });

    test("Correct phone, should not have error return code 200", async () => {
      const res = await request(server)
        .post(`${URI_BASE}/resend-verification/phone`)
        .send({
          phone: signUpUser.phone,
        })
        .set("Accept", "application/json");
      const response: ISuccessResponseDto = JSON.parse(res.text);
      expect(response.hasError).toBe(false);
      expect(response.code).toEqual(200);
    });

    test("Correct email, should not have error return code 200", async () => {
      const res = await request(server)
        .post(`${URI_BASE}/resend-verification/email`)
        .send({
          email: signUpUser.email,
        })
        .set("Accept", "application/json");
      const response: ISuccessResponseDto = JSON.parse(res.text);
      expect(response.hasError).toBe(false);
      expect(response.code).toEqual(200);
    });
  });
});

describe("change password endpoint", () => {
  test("wrong old password, should have error and return 401", async () => {
    const res = await request(server)
      .patch(`${URI_BASE}/change-password`)
      .send({
        old_password: signUpUser.password + "jab",
        new_password: signUpUser.new_password,
      })
      .set("Accept", "application/json")
      .set("Authorization", "Bearer " + global.validToken!);

    const response: IErrorResponseDto = JSON.parse(res.text);
    expect(response.hasError).toBe(true);
    expect(response.errors.code).toEqual(401);
  });

  test("correct old password, should not have error return code 200", async () => {
    const res = await request(server)
      .patch(`${URI_BASE}/change-password`)
      .send({
        old_password: signUpUser.password,
        new_password: signUpUser.new_password,
      })
      .set("Accept", "application/json")
      .set("Authorization", "Bearer " + global.validToken!);
    const response: ISuccessResponseDto = JSON.parse(res.text);
    expect(response.hasError).toBe(false);
    expect(response.code).toEqual(200);
  });
});

describe("forgot password endpoint", () => {
  test("wrong email, should have error and return 401", async () => {
    const res = await request(server)
      .patch(`${URI_BASE}/forgot-password`)
      .send({
        email: invalidTestUser.email,
      })
      .set("Accept", "application/json");

    const response: IErrorResponseDto = JSON.parse(res.text);
    expect(response.hasError).toBe(true);
    expect(response.errors.code).toEqual(401);
  });

  test("correct email, should not have error return code 200", async () => {
    const res = await request(server)
      .patch(`${URI_BASE}/forgot-password`)
      .send({
        email: signUpUser.email,
      })
      .set("Accept", "application/json");

    const response: ISuccessResponseDto = JSON.parse(res.text);
    expect(response.hasError).toBe(false);
    expect(response.code).toEqual(200);
  });

  test("wrong phone, should have error and return 401", async () => {
    const res = await request(server)
      .patch(`${URI_BASE}/forgot-password`)
      .send({
        phone: invalidTestUser.phone,
      })
      .set("Accept", "application/json");

    const response: IErrorResponseDto = JSON.parse(res.text);
    expect(response.hasError).toBe(true);
    expect(response.errors.code).toEqual(401);
  });

  test("correct phone, should not have error return code 200", async () => {
    const res = await request(server)
      .patch(`${URI_BASE}/forgot-password`)
      .send({
        phone: signUpUser.phone,
      })
      .set("Accept", "application/json");

    const response: ISuccessResponseDto = JSON.parse(res.text);
    expect(response.hasError).toBe(false);
    expect(response.code).toEqual(200);
  });
});

describe("edit profile", () => {
  test("any null, should have error and return 401", async () => {
    const res = await request(server)
      .patch(`${URI_BASE}/edit-profile`)
      .send({
        ...updatedTestUser,
        first_name: null,
      })
      .set("Accept", "application/json")
      .set("Authorization", "Bearer " + global.validToken!);

    const response: IErrorResponseDto = JSON.parse(res.text);
    expect(response.hasError).toBe(true);
    expect(response.errors.code).toEqual(500);
  });

  test("valid values updates user profile, should not have error return code 200", async () => {
    const res = await request(server)
      .patch(`${URI_BASE}/edit-profile`)
      .send({
        ...updatedTestUser,
      })
      .set("Accept", "application/json")
      .set("Authorization", "Bearer " + global.validToken!);

    const response: ISuccessResponseDto = JSON.parse(res.text);
    expect(response.hasError).toBe(false);
    expect(response.code).toEqual(200);
  });
});

describe("view user details", () => {
  beforeAll(async () => {
    global.validUserId = (await AppDataSource.getRepository(User).find({ take: 1 }))[0].id;
  });

  test("given invalid 'user_id', should have error, returns code 500", async () => {
    const res = await request(server).get(`${URI_BASE}/details/${randomInvalidId}`);
    const response: IErrorResponseDto = res.body;

    expect(response.hasError).toBeTruthy();
    expect(response.errors.code).toEqual(500);
  });

  test(`given valid 'user_id', should not have error, returns code 200 and user payload containing 
        (
          id, phone, email, 
          first_name, last_name, profile_pic_url
    )`, async () => {
    const res = await request(server).get(`${URI_BASE}/details/${global.validUserId}`);
    const response: ISuccessResponseDto = res.body;

    expect(response.hasError).toBeFalsy();
    expect(response.code).toEqual(200);
    expect(response.data.user).toEqual(
      expect.objectContaining({
        first_name: expect.any(String),
        id: expect.any(Number),
        email: expect.any(String),
      }),
    );
  });
});
