import { Request, Response, Router } from "express";
import userRouter from "./users";

const apiRouter = Router();

apiRouter.get("/health-check", (_req: Request, res: Response) => {
  res.status(200).json({ message: "All good" });
});
apiRouter.use("/users", userRouter);

export default apiRouter;
