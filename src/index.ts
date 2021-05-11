import { SetupServer } from './server';
import config from 'config';

// Self invocked function
(async (): Promise<void> => {
  const server = new SetupServer(config.get('App.port'));
  await server.init();
  server.start();
})();
