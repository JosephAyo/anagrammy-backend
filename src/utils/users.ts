import { AppDataSource } from "@database/data-source";
import { User } from "@database/entity/User";
import {  hashString } from "./auth";

const userRepository = AppDataSource.getRepository(User);
export const getUserById = async (id: number): Promise<User | null> => {
  return await userRepository.createQueryBuilder().where(`"id" = :id`, { id }).getOne();
};

export const getUserByEmail = async (email: string): Promise<User | null> => {
  return await userRepository.createQueryBuilder().where(`"email" ILIKE :email`, { email }).getOne();
};

export const getUserByPhone = async (phone: string): Promise<User | null> => {
  return await userRepository.createQueryBuilder().where(`"phone" = :phone`, { phone }).getOne();
};

export const signInUser = async (userId: string) => {
  return await userRepository.update(
    { id: userId },
    {
      last_login: new Date(),
    },
  );
};

export const updatePassword = async (user: User, newPassword: string) => {
  const hashedPassword = await hashString(newPassword);
  user!.password = hashedPassword;
  await user?.save();
};