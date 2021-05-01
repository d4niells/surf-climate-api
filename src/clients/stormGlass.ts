import { AxiosStatic } from 'axios';

export class StormGlass {
  readonly stormGlassAPIParams =
    'swellDirection, swellHeight, swellPeriod, waveDirection, waveHeight, windDirection, windSpeed';
  readonly stormGlassSource = 'noaaa';

  constructor(protected request: AxiosStatic) {}

  public async fetchPoints(lat: number, lng: number): Promise<{ s: '' }> {
    return this.request.get(
      `https://api.stormglass.io/v2/weather/point?params=${this.stormGlassAPIParams}&source=${this.stormGlassSource}&lat=${lat}&lng=${lng}`
    );
  }
}
