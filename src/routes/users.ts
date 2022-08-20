import { passportMiddleWareOpts } from "@config/passportHandler";
import { UserService } from "@services/users";
import { ResponseWrapper } from "@utils/responses";
import { Request, RequestHandler, Response, Router } from "express";
import passportHandler from "@config/passportHandler";

const userRouter = Router();

userRouter.post("/sign-up", (async (req: Request, res: Response) => {
  const responseWrapper = new ResponseWrapper(res);
  const userService = new UserService(req, responseWrapper);
  return userService.signUp();
}) as RequestHandler);

userRouter.post("/sign-in", (async (req: Request, res: Response) => {
  const responseWrapper = new ResponseWrapper(res);
  const userService = new UserService(req, responseWrapper);
  return userService.signIn();
}) as RequestHandler);

userRouter.get("/profile/view", passportHandler.authenticate("jwt", passportMiddleWareOpts), (async (req: Request, res: Response) => {
  const responseWrapper = new ResponseWrapper(res);
  const userService = new UserService(req, responseWrapper);
  return userService.viewProfile();
}) as RequestHandler);

userRouter.patch("/change-password", passportHandler.authenticate("jwt", passportMiddleWareOpts), (async (req: Request, res: Response) => {
  const responseWrapper = new ResponseWrapper(res);
  const userService = new UserService(req, responseWrapper);
  return userService.changePassword();
}) as RequestHandler);

userRouter.patch("/edit-profile", passportHandler.authenticate("jwt", passportMiddleWareOpts), (async (req: Request, res: Response) => {
  const responseWrapper = new ResponseWrapper(res);
  const userService = new UserService(req, responseWrapper);
  return userService.editProfile();
}) as RequestHandler);


userRouter.post("/check-anagram", (async (req: Request, res: Response) => {
  const responseWrapper = new ResponseWrapper(res);
  const userService = new UserService(req, responseWrapper);
  return userService.checkAnagram();
}) as RequestHandler);

export default userRouter;
