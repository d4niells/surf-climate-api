import mongoose from 'mongoose';
import { Response } from 'express';

import { CUSTOM_VALIDATION } from '@src/models/user';

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
      response.status(clientErrors.code).send(clientErrors);
    } else {
      response.status(500).send({ code: 500, error: 'Something went wronng!' });
    }
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
