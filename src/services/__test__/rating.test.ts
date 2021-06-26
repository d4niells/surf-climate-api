import { Beach, BeachPosition } from '@src/models/beach';
import { Rating } from '@src/services/rating';

describe('Rating Service', () => {
  const defaultBeach: Beach = {
    lat: -33.792726,
    lng: 151.289824,
    name: 'Manly',
    position: BeachPosition.east,
    user: 'some-user',
  };

  const defaultRating = new Rating(defaultBeach);

  describe('Calculate rating for a given point', () => {
    // TODO
  });

  describe('Get rating based on wind and positions', () => {
    it('should get rating 1 for a beach with onshore winds', () => {
      const rating = defaultRating.getRatingBasedOnWindAndWavePositions(
        BeachPosition.east,
        BeachPosition.east
      );
      expect(rating).toBe(1);
    });

    it('should get rating 3 for a beach with cross winds', () => {
      const rating = defaultRating.getRatingBasedOnWindAndWavePositions(
        BeachPosition.east,
        BeachPosition.south
      );
      expect(rating).toBe(3);
    });

    it('should get rating 5 for a beach with offshore winds', () => {
      const rating = defaultRating.getRatingBasedOnWindAndWavePositions(
        BeachPosition.east,
        BeachPosition.west
      );
      expect(rating).toBe(5);
    });
  });

  /**
   * Period calculation only tests
   */
  describe('Get rating based on swell period', () => {
    it('should get a rating of 1 for a period of 5 seconds', () => {
      const rating = defaultRating.getRatingForSwellPeriod(5);
      expect(rating).toBe(1);
    });

    it('should get a rating of 2 for a period of 9 seconds', () => {
      const rating = defaultRating.getRatingForSwellPeriod(9);
      expect(rating).toBe(2);
    });

    it('should get a rating of 4 for a period of 12 seconds', () => {
      const rating = defaultRating.getRatingForSwellPeriod(12);
      expect(rating).toBe(4);
    });

    it('should get a rating of 5 for a period of 16 seconds', () => {
      const rating = defaultRating.getRatingForSwellPeriod(16);
      expect(rating).toBe(5);
    });
  });
});
