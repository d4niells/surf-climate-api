import { Beach } from '@src/models/beaches';
import { ForecastPoint, StormGlass } from '@src/clients/stormGlass';
import { ForecastProcessingInternalError } from '@src/utils/errors/forecast-processing-internal-error';

export interface TimeForecast {
  time: string;
  forecast: BeachForecast[];
}

export interface BeachForecast extends Omit<Beach, 'user'>, ForecastPoint {}

export class Forecast {
  constructor(protected stormGlass = new StormGlass()) {}

  public async processForecastForBeaches(
    beaches: Beach[]
  ): Promise<TimeForecast[]> {
    try {
      const pointsWithCorrectSource: BeachForecast[] = [];

      for (const beach of beaches) {
        const points = await this.stormGlass.fetchPoints(beach.lat, beach.lng);

        const enrichedBeachData = this.enrichedBeachData(points, beach);

        pointsWithCorrectSource.push(...enrichedBeachData);
      }

      return this.mapForecastByTime(pointsWithCorrectSource);
    } catch (err) {
      throw new ForecastProcessingInternalError(err.message);
    }
  }

  private enrichedBeachData(
    points: ForecastPoint[],
    beach: Beach
  ): BeachForecast[] {
    const { lat, lng, name, position } = beach;

    return points.map((point) => ({
      ...point,
      lat,
      lng,
      name,
      position,
      rating: 1,
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
