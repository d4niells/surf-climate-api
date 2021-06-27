import './utils/module-alias';

import express, { Application } from 'express';
import expressPino from 'express-pino-logger';
import { Server } from '@overnightjs/core';
import swaggerUI from 'swagger-ui-express';
import cors from 'cors';

import { OpenApiValidator } from 'express-openapi-validator';
import { OpenAPIV3 } from 'express-openapi-validator/dist/framework/types';

import config from 'config';

import * as database from '@src/database';
import logger from '@src/logger';

import { ForecastController } from '@src/controllers/forecast';
import { BeachesController } from '@src/controllers/beaches';
import { UsersController } from '@src/controllers/users';

import apiScheme from '@src/api.schema.json';

export class SetupServer extends Server {
  constructor(private port: number = config.get('App.port')) {
    super();
  }

  public async init(): Promise<void> {
    this.setupExpress();
    await this.docsSetup();
    this.setupControllers();
    await this.databaseSetup();
  }

  private setupExpress(): void {
    this.app.use(express.json());
    this.app.use(expressPino({ logger }));
    this.app.use(cors({ origin: '*' }));
  }

  private setupControllers(): void {
    const forecastController = new ForecastController();
    const beachesController = new BeachesController();
    const usersController = new UsersController();

    this.addControllers([
      forecastController,
      beachesController,
      usersController,
    ]);
  }

  private async docsSetup(): Promise<void> {
    this.app.use('/docs', swaggerUI.serve, swaggerUI.setup(apiScheme));

    await new OpenApiValidator({
      apiSpec: apiScheme as OpenAPIV3.Document,
      validateRequests: true,
      validateResponses: true,
    }).install(this.app);
  }

  private async databaseSetup(): Promise<void> {
    await database.connect();
  }

  public start(): void {
    this.app.listen(this.port, () => {
      logger.info('Server listening of port: ' + this.port);
    });
  }

  public async close(): Promise<void> {
    await database.close();
  }

  public getApp(): Application {
    return this.app;
  }
}
