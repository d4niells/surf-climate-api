import { Request, Response } from 'express';
import { ClassMiddleware, Controller, Post } from '@overnightjs/core';

import { Beach } from '@src/models/beach';

import { BaseController } from '@src/controllers';

import { authMiddleware } from '@src/middlewares/auth';

import logger from '@src/logger';

@Controller('beaches')
@ClassMiddleware(authMiddleware)
export class BeachesController extends BaseController {
  @Post('')
  public async create(request: Request, response: Response): Promise<void> {
    try {
      const beach = new Beach({ ...request.body, userId: request.decoded?.id });
      const result = await beach.save();
      response.status(201).send(result);
    } catch (error) {
      logger.error(error);
      this.sendCreateUpdateErrorResponse(response, error);
    }
  }
}
