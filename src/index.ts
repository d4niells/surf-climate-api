import { SetupServer } from './server';
import config from 'config';

import logger from './logger';

enum ExitStatus {
  Failure = 1,
  Success = 0,
}

// Self invocked function to start and exit app
(async (): Promise<void> => {
  try {
    const server = new SetupServer(config.get('App.port'));
    await server.init();
    server.start();

    const exitSignals: NodeJS.Signals[] = ['SIGINT', 'SIGTERM', 'SIGQUIT'];

    exitSignals.map((signal) =>
      process.on(signal, async () => {
        try {
          await server.close();
          logger.info(`App exited with sucess. Signal: ${signal}`);
          process.exit(ExitStatus.Success);
        } catch (error) {
          logger.error(`App exited with error: ${error}`);
          process.exit(ExitStatus.Failure);
        }
      })
    );
  } catch (error) {
    logger.error(`App exited with error: ${error}`);
    process.exit(ExitStatus.Failure);
  }
})();
