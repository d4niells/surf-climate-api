import { ForecastPoint, StormGlass } from '@src/clients/stormGlass';

export enum BeachPosition {
  north = 'N',
  south = 'S',
  east = 'E',
  west = 'W',
}

export interface Beach {
  name: string;
  position: BeachPosition;
  lat: number;
  lng: number;
  user: string;
}

export interface BeachForecast extends Omit<Beach, 'user'>, ForecastPoint {}

export class Forecast {
  constructor(protected stormGlass = new StormGlass()) {}

  public async processForecastForBeaches(
    beaches: Beach[]
  ): Promise<BeachForecast[]> {
    const pointsWithCorrectSource: BeachForecast[] = [];

    for (const beach of beaches) {
      const { lat, lng, name, position } = beach;

      const points = await this.stormGlass.fetchPoints(lat, lng);
      const enrichedBeachData = points.map((point) => ({
        ...point,
        lat,
        lng,
        name,
        position,
        rating: 1,
      }));

      pointsWithCorrectSource.push(...enrichedBeachData);
    }

    return pointsWithCorrectSource;
  }
}
