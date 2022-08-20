import faker from "@withshepherd/faker";

export const global: {
  testCategoryId?: number;
  testSubCategoryId?: number;
} = {};

export const testSubCategory = {
  name: faker.commerce.department()
};
