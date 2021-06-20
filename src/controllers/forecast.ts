import { Request, Response } from 'express';
import { Controller, Get } from '@overnightjs/core';

import { Beach } from '@src/models/beach';

import { ForecastService } from '@src/services/forecast';

const forecast = new ForecastService();

@Controller('forecast')
export class ForecastController {
  @Get('')
  public async getForecastForLoggedUser(
    _: Request,
    response: Response
  ): Promise<void> {
    try {
      const beaches = await Beach.find({});
      const forecastData = await forecast.processForecastForBeaches(beaches);
      response.status(200).send(forecastData);
    } catch (err) {
      response.status(500).send({ error: 'Something went wrong' });
    }
  }
}
