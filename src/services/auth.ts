import bcrypt from 'bcrypt';

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
}
