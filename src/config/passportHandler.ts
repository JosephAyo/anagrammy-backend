import { AppDataSource } from "@database/data-source";
import { User } from "@database/entity/User";
import { IResponseError } from "@utils/responses";
import passport from "passport";
import passportJwt from "passport-jwt";
const userRepository = AppDataSource.getRepository(User);
const JwtStrategy = passportJwt.Strategy;
const ExtractJwt = passportJwt.ExtractJwt;
passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    },
    async (verifiedToken, done) => {
      try {
        const user = await userRepository
          .createQueryBuilder()
          .where(`"id" = :id`, { id: verifiedToken.id })
          .andWhere(`"email" = :email`, { email: verifiedToken.email })
          .getOne();
        let error: IResponseError;
        if (!user) {
          error = new Error("Unauthorized");
          error.status = 401;
          return done(error);
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    },
  ),
);

passport.serializeUser(function (user, cb) {
  cb(null, user);
});

passport.deserializeUser(function (obj: any, cb) {
  cb(null, obj);
});

export default passport;

export const passportMiddleWareOpts = {
  session: false,
  failWithError: true,
};
