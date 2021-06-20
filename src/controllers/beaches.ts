import mongoose from 'mongoose';
import { Request, Response } from 'express';
import { ClassMiddleware, Controller, Post } from '@overnightjs/core';

import { Beach } from '@src/models/beach';

import { authMiddleware } from '@src/middlewares/auth';

import logger from '@src/logger';

@Controller('beaches')
@ClassMiddleware(authMiddleware)
export class BeachesController {
  @Post('')
  public async create(request: Request, response: Response): Promise<void> {
    try {
      const beach = new Beach({ ...request.body, user: request.decoded?.id });
      const result = await beach.save();
      response.status(201).send(result);
    } catch (error) {
      if (error instanceof mongoose.Error.ValidationError) {
        response.status(422).send({ error: error.message });
      } else {
        logger.error(error);
        response.status(500).send({ error: 'Internal Server Error ' });
      }
    }
  }
}
