import mongoose from 'mongoose';
import { Response } from 'express';
import httpStatusCodes from 'http-status-codes';

import { CUSTOM_VALIDATION } from '@src/models/user';

import logger from '@src/logger';
import ApiError, { APIError } from '@src/utils/errors/api-error';

interface Error {
  code: number;
  error: string;
}
export abstract class BaseController {
  protected sendCreateUpdateErrorResponse(
    response: Response,
    error: mongoose.Error.ValidationError | Error
  ): void {
    if (error instanceof mongoose.Error.ValidationError) {
      const clientErrors = this.handleClientErros(error);
      response.status(clientErrors.code).send(
        ApiError.format({
          code: clientErrors.code,
          message: clientErrors.error,
        })
      );
    } else {
      logger.error(error);
      response.status(httpStatusCodes.INTERNAL_SERVER_ERROR).send(
        ApiError.format({
          code: httpStatusCodes.INTERNAL_SERVER_ERROR,
          message: 'Something went wronng!',
        })
      );
    }
  }

  protected sendErrorResponse(
    response: Response,
    apiError: APIError
  ): Response {
    return response.status(apiError.code).send(ApiError.format(apiError));
  }

  private handleClientErros(error: mongoose.Error.ValidationError): Error {
    const duplicatedKindErrors = Object.values(error.errors).filter(
      (err) => err.kind === CUSTOM_VALIDATION.DUPLICATED
    );

    if (duplicatedKindErrors.length) {
      return { code: 409, error: error.message };
    }
    return { code: 422, error: error.message };
  }
}
