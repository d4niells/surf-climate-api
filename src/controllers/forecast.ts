import { Request, Response } from 'express';
import httpStatusCodes from 'http-status-codes';
import { Controller, Get } from '@overnightjs/core';

import { Beach } from '@src/models/beach';

import { ForecastService } from '@src/services/forecast';

import logger from '@src/logger';
import { BaseController } from '.';

const forecast = new ForecastService();

@Controller('forecast')
export class ForecastController extends BaseController {
  @Get('')
  public async getForecastForLoggedUser(
    _: Request,
    response: Response
  ): Promise<void> {
    try {
      const beaches = await Beach.find({});
      const forecastData = await forecast.processForecastForBeaches(beaches);
      response.status(200).send(forecastData);
    } catch (error) {
      logger.error(error);
      this.sendErrorResponse(response, {
        code: httpStatusCodes.INTERNAL_SERVER_ERROR,
        message: 'Something went wrong',
      });
    }
  }
}
