import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from 'config';
import { User } from '@src/models/user';

export interface DecodedUser extends Omit<User, '_id'> {
  id: string;
}

export class Auth {
  public static async hashPassword(
    password: string,
    saltOrRounds = 10
  ): Promise<string> {
    return await bcrypt.hash(password, saltOrRounds);
  }

  public static async comparePasswords(
    password: string,
    hashPassword: string
  ): Promise<boolean> {
    return await bcrypt.compare(password, hashPassword);
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  public static generateToken(payload: object): string {
    const tokenSecretKey: string = config.get('App.auth.tokenSecretKey');
    const tokenExpiresIn: string = config.get('App.auth.tokenExpiresIn');

    return jwt.sign(payload, tokenSecretKey, {
      expiresIn: tokenExpiresIn,
    });
  }

  public static decodeToken(token: string): DecodedUser {
    const tokenSecretKey: string = config.get('App.auth.tokenSecretKey');
    const decodedToken = jwt.verify(token, tokenSecretKey) as DecodedUser;
    return decodedToken;
  }
}
