import { Request, Response } from 'express';
import { Controller, Post } from '@overnightjs/core';

import { User } from '@src/models/user';

import { BaseController } from '@src/controllers';

import { Auth } from '@src/services/auth';

@Controller('users')
export class UsersController extends BaseController {
  @Post('')
  public async create(request: Request, response: Response): Promise<void> {
    try {
      const user = new User(request.body);
      const newUser = await user.save();
      response.status(201).send(newUser);
    } catch (error) {
      this.sendCreateUpdateErrorResponse(response, error);
    }
  }

  @Post('authenticate')
  public async authenticate(
    request: Request,
    response: Response
  ): Promise<Response | undefined> {
    const { email, password } = request.body;

    const user = await User.findOne({ email: email });

    if (!user)
      return response.status(401).send({ code: 401, error: 'User not found!' });

    const validPassword = await Auth.comparePasswords(password, user.password);
    if (!validPassword)
      return response
        .status(401)
        .send({ code: 401, error: 'Password does not match!' });

    const token = Auth.generateToken(user.toJSON());

    return response.status(200).send({ token: token });
  }
}
