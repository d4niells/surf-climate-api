import { SetupServer } from '@src/server';
import supertest from 'supertest';

let server: SetupServer;
// Execute before all aplication tests
beforeAll(async () => {
  server = new SetupServer();
  await server.init();

  // Set global configs of tests
  global.testRequest = supertest(server.getApp());
});

afterAll(async () => {
  await server.close();
});
