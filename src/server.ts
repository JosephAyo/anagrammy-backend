import express, { Express, NextFunction, Request, Response } from "express";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import apiRouter from "@routes/api";
import { IResponseError, ResponseWrapper } from "@utils/responses";
import "@config/passportHandler";
const PREFIX = "/api/" + process.env.version || "v1";

const app: Express = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(cors());

// Security
if (process.env.NODE_ENV === "production" || process.env.NODE_ENV === "staging") {
  app.use(
    helmet({
      crossOriginEmbedderPolicy: false,
    }),
  );
}

app.get("/", (_req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.use(PREFIX, apiRouter);

app.use("/*", (_req: Request, _res: Response, next) => {
  let error: IResponseError = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use((error: IResponseError, _req: Request, res: Response, _next: NextFunction) => {
  const response = new ResponseWrapper(res);
  const title = error.status == 404 ? "Invalid endpoint" : "Unauthorized";
  return response.ErrorResponse({
    title,
    message: error.message,
    code: error.status,
  });
});

export default app;
