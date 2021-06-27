import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import {
  ClassMiddleware,
  Controller,
  Get,
  Middleware,
} from '@overnightjs/core';

import { authMiddleware } from '@src/middlewares/auth';
import { rateLimiter } from '@src/middlewares/rate-limiter';

import { Beach } from '@src/models/beach';

import { ForecastService } from '@src/services/forecast';

import logger from '@src/logger';

import { BaseController } from '.';

const forecast = new ForecastService();

@Controller('forecast')
@ClassMiddleware(authMiddleware)
export class ForecastController extends BaseController {
  @Get('')
  @Middleware(rateLimiter)
  public async getForecastForLoggedUser(
    request: Request,
    response: Response
  ): Promise<void> {
    try {
      const beaches = await Beach.find({ user: request.decoded?.id });
      const forecastData = await forecast.processForecastForBeaches(beaches);

      response.status(StatusCodes.OK).send(forecastData);
    } catch (error) {
      logger.error(error);
      this.sendErrorResponse(response, {
        code: StatusCodes.INTERNAL_SERVER_ERROR,
        message: 'Something went wrong',
      });
    }
  }
}
