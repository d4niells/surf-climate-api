import { SetupServer } from '@src/server';
import supertest from 'supertest';

// Executa antes de todos os testes
beforeAll(() => {
  const server = new SetupServer();
  server.init();
  global.testRequest = supertest(server.getApp());
})