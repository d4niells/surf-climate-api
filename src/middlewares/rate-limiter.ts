import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import rateLimit from 'express-rate-limit';

import ApiError from '@src/utils/errors/api-error';

const rateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 10,
  keyGenerator(request: Request): string {
    const userIP = request.ip;
    return userIP;
  },
  handler(_, response: Response): void {
    response.status(StatusCodes.TOO_MANY_REQUESTS).send(
      ApiError.format({
        code: StatusCodes.TOO_MANY_REQUESTS,
        message: 'Too many requests to the /forecast endpoint',
      })
    );
  },
});

export { rateLimiter };
