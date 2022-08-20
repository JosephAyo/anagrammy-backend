import { AppDataSource } from "@database/data-source";
import { Store } from "@database/entity/Store";
import { AdminRole, User } from "@database/entity/User";
import { ResponseWrapper } from "@utils/responses";
import { NextFunction, Request, RequestHandler, Response } from "express";
const storeRepository = AppDataSource.getRepository(Store);
import passportJwt from "passport-jwt";
const ExtractJwt = passportJwt.ExtractJwt;
import jwt from "jsonwebtoken";
const userRepository = AppDataSource.getRepository(User);

export const authorizeAdmin = (permittedAdminRoles: AdminRole[]) => {
  return ((req: Request, res: Response, next: NextFunction) => {
    const { user } = req;
    const responseWrapper = new ResponseWrapper(res);
    if (permittedAdminRoles.includes(user.role as AdminRole)) return next();
    return responseWrapper.ErrorResponse({ title: "Error", code: 401, message: "you are not authorized to access this route" });
  }) as RequestHandler;
};

export const authorizeStoreOwner = () => {
  return (async (req: Request, res: Response, next: NextFunction) => {
    const { params } = req;
    const { user } = req;
    const { store_id } = params;
    const store = await storeRepository
      .createQueryBuilder()
      .where(`"id" = :id`, { id: store_id })
      .andWhere(`"user_id" = :user_id`, { user_id: user.id })
      .getOne();
    const responseWrapper = new ResponseWrapper(res);
    if (!store) return responseWrapper.ErrorResponse({ title: "Error", code: 401, message: "you are not authorized to access this store" });
    return next();
  }) as RequestHandler;
};

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
