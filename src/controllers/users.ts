import { Controller, Post } from '@overnightjs/core';
import { Request, Response } from 'express';
import { User } from '@src/models/user';

@Controller('users')
export class UsersController {
  @Post('')
  public async create(request: Request, response: Response): Promise<void> {
    const user = new User(request.body);
    const newUser = await user.save();
    response.status(201).send(newUser);
  }
}
