import { Beach } from '@src/models/beach';

import { ForecastPoint, StormGlass } from '@src/clients/stormGlass';

import { Rating } from '@src/services/rating';

import { ForecastProcessingInternalError } from '@src/utils/errors/forecast-processing-internal-error';

import logger from '@src/logger';

export interface TimeForecast {
  time: string;
  forecast: BeachForecast[];
}

export interface BeachForecast extends Omit<Beach, 'user'>, ForecastPoint {}

type RatingService = typeof Rating;

export class ForecastService {
  constructor(
    protected stormGlass = new StormGlass(),
    protected RatingService: RatingService = Rating
  ) {}

  public async processForecastForBeaches(
    beaches: Beach[]
  ): Promise<TimeForecast[]> {
    logger.info(`Preparing the forecast for ${beaches.length} beaches`);

    try {
      const pointsWithCorrectSource: BeachForecast[] = [];

      for (const beach of beaches) {
        const rating = new this.RatingService(beach);
        const points = await this.stormGlass.fetchPoints(beach.lat, beach.lng);

        const enrichedBeachData = this.enrichedBeachData(points, beach, rating);

        pointsWithCorrectSource.push(...enrichedBeachData);
      }

      return this.mapForecastByTime(pointsWithCorrectSource);
    } catch (error) {
      logger.error(error);
      throw new ForecastProcessingInternalError(error.message);
    }
  }

  private enrichedBeachData(
    points: ForecastPoint[],
    beach: Beach,
    rating: Rating
  ): BeachForecast[] {
    const { lat, lng, name, position } = beach;

    return points.map((point) => ({
      ...point,
      lat,
      lng,
      name,
      position,
      rating: rating.getRateForPoint(point),
    }));
  }

  private mapForecastByTime(forecast: BeachForecast[]): TimeForecast[] {
    const forecastByTime: TimeForecast[] = [];

    for (const point of forecast) {
      const timePoint = forecastByTime.find(
        (forecast) => forecast.time === point.time
      );

      if (timePoint) {
        timePoint.forecast.push(point);
      } else {
        forecastByTime.push({
          time: point.time,
          forecast: [point],
        });
      }
    }

    return forecastByTime;
  }
}
