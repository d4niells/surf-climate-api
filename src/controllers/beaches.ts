import { Controller, Post } from '@overnightjs/core';
import { Request, Response } from 'express';
import { Beach } from '@src/models/beaches';

@Controller('beaches')
export class BeachesController {
  @Post('')
  public async create(request: Request, response: Response): Promise<void> {
    const beach = new Beach(request.body);
    const result = await beach.save();
    response.status(201).send(result);
  }
}
