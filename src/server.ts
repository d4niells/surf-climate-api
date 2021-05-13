import './utils/module-alias';

import express, { Application } from 'express';
import { Server } from '@overnightjs/core';
import config from 'config';
import { ForecastController } from '@src/controllers/forecast';
import { BeachesController } from '@src/controllers/beaches';
import * as database from '@src/database';
import { UsersController } from './controllers/users';

export class SetupServer extends Server {
  constructor(private port: number = config.get('App.port')) {
    super();
  }

  public async init(): Promise<void> {
    this.setupExpress();
    this.setupControllers();
    await this.databaseSetup();
  }

  private setupExpress(): void {
    this.app.use(express.json());
    this.setupControllers();
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

  private async databaseSetup(): Promise<void> {
    await database.connect();
  }

  public start(): void {
    this.app.listen(this.port, () => {
      console.info('Server listening of port: ', this.port);
    });
  }

  public async close(): Promise<void> {
    await database.close();
  }

  public getApp(): Application {
    return this.app;
  }
}
