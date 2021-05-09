import { Beach } from '@src/models/beaches';

describe('Beaches functional tests', () => {
  // detele all beaches before running application tests
  beforeAll(async () => await Beach.deleteMany({}));

  describe('When creating a new beach', () => {
    it('Should create a beach with success', async () => {
      const newBeach = {
        lat: -33.792726,
        lng: 151.289824,
        name: 'Manly',
        position: 'E',
      };

      const response = await global.testRequest.post('/beaches').send(newBeach);

      expect(response.status).toBe(201);
      expect(response.body).toEqual(expect.objectContaining(newBeach));
    });

    it('Should return status 422 when is a validation error', async () => {
      const newBeach = {
        lat: 'invalid_string',
        lng: 151.289824,
        name: 'Manly',
        position: 'E',
      };

      const response = await global.testRequest.post('/beaches').send(newBeach);

      expect(response.status).toBe(422);
      expect(response.body).toEqual({
        error:
          'Beach validation failed: lat: Cast to Number failed for value "invalid_string" at path "lat"',
      });
    });

    it.skip('Should return status 500 when there is any error than validation error', async () => {
      // validate status 500 (Internal Server Error)
    });
  });
});
