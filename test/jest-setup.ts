import { SetupServer } from '@src/server';
import supertest from 'supertest';

// Execute before all aplication tests
beforeAll(() => {
  const server = new SetupServer();
  server.init();

  // Set global configs of tests
  global.testRequest = supertest(server.getApp());
});
