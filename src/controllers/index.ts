import { Response } from 'express';
import mongoose from 'mongoose';

export abstract class BaseController {
  protected sendCreatedUpdateErrorResponse(
    response: Response,
    error: mongoose.Error.ValidationError | Error
  ): void {
    if (error instanceof mongoose.Error.ValidationError) {
      response.status(422).send({ code: 422, error: error.message });
    } else {
      response.status(500).send({ code: 500, error: 'Something went wronng!' });
    }
  }
}
