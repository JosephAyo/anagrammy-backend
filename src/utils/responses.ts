import { Response } from "express";
import Joi from "joi";

interface ResponseArgs {
  title: string;
  code?: number;
  message?: string;
  data?: any;
}

export interface IResponseWrapper {
  SuccessResponse(args: ResponseArgs): Response;
  ErrorResponse(args: ResponseArgs): Response;
}

export interface ISuccessResponseDto extends ResponseArgs {
  hasError: boolean;
}

export interface IErrorResponseDto {
  hasError: boolean;
  errors: ResponseArgs;
}

export interface IResponseError extends Error {
  status?: number;
}

export interface IUtilDto {
  isSuccess: boolean;
  message: string;
  data?: any;
  [key: string]: any;
}

export class ResponseWrapper implements IResponseWrapper {
  readonly res: Response;
  constructor(res: Response) {
    this.res = res;
  }

  SuccessResponse(args: ResponseArgs) {
    const { title, message, data, code } = args;
    if (process.env.LOG_ENDPOINT_RESPONSES) console.log("message :>> ", message);
    return this.res.status(200).json({
      hasError: false,
      title,
      code,
      message,
      data,
    });
  }

  ErrorResponse(args: ResponseArgs) {
    const { title, code } = args;
    let { message } = args;
    if (process.env.LOG_ENDPOINT_RESPONSES) console.log("message :>> ", message);
    if (Joi.isError(message)) {
      message = message.details.map((detail) => detail.message).join(", ");
    }
    return this.res.status(200).json({
      hasError: true,
      errors: {
        title,
        code,
        message,
      },
    });
  }
}
