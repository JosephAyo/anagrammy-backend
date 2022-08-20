import { User } from "@database/entity/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
const { SALT_ROUNDS, JWT_SECRET } = process.env;
export const hashString = async (plainString: string) => {
  return await bcrypt.hash(plainString, parseInt(SALT_ROUNDS as string));
};

export const compareHashedString = async (plainString: string, hashedString: string): Promise<boolean> => {
  return await bcrypt.compare(plainString, hashedString);
};

export const generateUserJWT = (user: User) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      last_login: user.last_login,
    },
    JWT_SECRET as string,
    { expiresIn: "45d" },
  );
};

export const generateRandomHexCode = (size: number) => {
  return crypto.randomBytes(size).toString("hex");
};

export const generateRandomNumberCode = (max = 1000) => {
  const code = crypto.randomInt(0, max);
  return code.toString().padStart(4, "0");
};

export const passwordRegexPattern = /\w{8,20}/;
// export const passwordRegexPattern = /(?=.*[a-z])(?=.*[A-Z])(?=.*d)(?=.*[$@$!#._])[A-Za-zd$@$!%*?&.]{8,20}/;

export interface IDecodedAppleToken extends jwt.JwtPayload {
  email?: string;
} 
