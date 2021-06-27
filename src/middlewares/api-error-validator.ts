/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';

import ApiError from '@src/utils/errors/api-error';

export interface HTTPError extends Error {
  status?: number;
}

const apiErrorValidator = (
  error: HTTPError,
  _: Partial<Request>,
  response: Response,
  __: NextFunction
): void => {
  const errorCode = error.status || StatusCodes.INTERNAL_SERVER_ERROR;

  response
    .status(errorCode)
    .send(ApiError.format({ code: errorCode, message: error.message }));
};

export { apiErrorValidator };
