import { BeachPosition, Beach } from '@src/models/beach';

export class Rating {
  constructor(private beach: Beach) {}

  public getRatingBasedOnWindAndWavePositions(
    wavePosition: BeachPosition,
    windPosition: BeachPosition
  ): number {
    if (wavePosition === windPosition) return 1;

    if (this.isWindOffShore(wavePosition, windPosition)) return 5;

    return 3;
  }

  public getRatingForSwellPeriod(period: number): number {
    if (period >= 7 && period < 10) {
      return 2;
    }

    if (period >= 10 && period < 14) {
      return 4;
    }

    if (period >= 14) {
      return 5;
    }

    return 1;
  }

  private isWindOffShore(
    waveDirection: string,
    windDirection: string
  ): boolean {
    return (
      (waveDirection === BeachPosition.north &&
        windDirection === BeachPosition.south &&
        this.beach.position === BeachPosition.north) ||
      (waveDirection === BeachPosition.south &&
        windDirection === BeachPosition.north &&
        this.beach.position === BeachPosition.south) ||
      (waveDirection === BeachPosition.east &&
        windDirection === BeachPosition.west &&
        this.beach.position === BeachPosition.east) ||
      (waveDirection === BeachPosition.west &&
        windDirection === BeachPosition.east &&
        this.beach.position === BeachPosition.west)
    );
  }
}
