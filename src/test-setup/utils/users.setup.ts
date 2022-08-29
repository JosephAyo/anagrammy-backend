import { globalTestUser } from "../jest.setup";

export const expectedUser = {
  username: globalTestUser.username,
  email: globalTestUser.email,
  phone: globalTestUser.phone,
};

export const password = "password";

export { globalTestUser };
