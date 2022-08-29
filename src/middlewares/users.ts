import { AppDataSource } from "@database/data-source";
import { User } from "@database/entity/User";
import { NextFunction, Request, RequestHandler, Response } from "express";
import passportJwt from "passport-jwt";
const ExtractJwt = passportJwt.ExtractJwt;
import jwt from "jsonwebtoken";
const userRepository = AppDataSource.getRepository(User);

export const extendReqWithUser = () => {
  return (async (req: Request, _res: Response, next: NextFunction) => {
    try {
      const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
      if (token) {
        const verifiedToken = jwt.verify(token, process.env.JWT_SECRET as string) as {
          id: string;
          email: string;
        };
        const user = await userRepository
          .createQueryBuilder()
          .where(`"id" = :id`, { id: verifiedToken.id })
          .andWhere(`"email" = :email`, { email: verifiedToken.email })
          .getOne();
        if (user) req.user = user;
        return next();
      }
    } catch (error) {
      console.log("error :>> ", error);
      return next();
    }
    return next();
  }) as RequestHandler;
};
