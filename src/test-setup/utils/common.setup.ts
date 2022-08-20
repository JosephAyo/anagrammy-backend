import faker from "@withshepherd/faker";


export const randomInvalidId = Math.ceil(Math.random() * 1000);
export const randomValidReviewExperience = faker.helpers.randomize(["negative", "neutral", "positive"])
export const randomInvalidReviewExperience = faker.helpers.randomize(["cat", "dog", "rat"])
