import jwt from "jsonwebtoken";
import faker from "@withshepherd/faker";

import { passwordRegexPattern } from "@utils/auth";
import { User } from "@database/entity/User";

const { JWT_SECRET, version } = process.env;

export const URI_BASE = `/api/${version}/users`;

export const global: {
  validToken?: string;
  invalidToken?: string;
  expiredToken?: string;
  validUserId?: string;
  [key: string]: any;
} = {};

export const signUpUser = {
  username: faker.name.firstName(),
  email: faker.internet.email(),
  phone: faker.phone.phoneNumber("###########"),
  password: faker.internet.password(8, true, passwordRegexPattern),
  new_password: faker.internet.password(8, true, passwordRegexPattern)
};


export const signUpUserNoLastName = {
  username: faker.name.firstName(),
  email: faker.internet.email(),
  phone: faker.phone.phoneNumber("###########"),
  password: faker.internet.password(8, true, passwordRegexPattern),
  new_password: faker.internet.password(8, true, passwordRegexPattern)
};


export const updatedTestUser = {
  username: faker.name.firstName(),
  address: faker.address.streetAddress(),
  country: faker.address.country()
};

export const invalidTestUser = {
  username: faker.name.firstName(),
  email: faker.internet.email(),
  phone: faker.phone.phoneNumber("###########"),
  password: faker.internet.password(8, true, passwordRegexPattern)
};

export const signBackDatedJWT = (user: User) => {
  return jwt.sign(
    {
      id: user!.id,
      email: user!.email,
      last_login: user!.last_login,
      iat: Math.floor(Date.now() / 1000) - 240,
      exp: Math.floor(Date.now() / 1000) - 120
    },
    JWT_SECRET as string
  );
};
