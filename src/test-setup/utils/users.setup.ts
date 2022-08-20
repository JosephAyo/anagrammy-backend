import { globalTestUser } from "../jest.setup";

export const expectedUser = {
  first_name: globalTestUser.first_name,
  last_name: globalTestUser.last_name,
  email: globalTestUser.email,
  phone: globalTestUser.phone,
  role: globalTestUser.role,
};

export const password = "password";

export { globalTestUser };
