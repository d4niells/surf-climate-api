export class TimeUtil {
  public static getUnixTimeForAFutureDay(days: number): number {
    const date = new Date();
    const futureDate = date.setDate(date.getDate() + days);
    const timestamp = futureDate.valueOf();

    const unixTime = Math.floor(timestamp / 1000);

    return unixTime;
  }
}
