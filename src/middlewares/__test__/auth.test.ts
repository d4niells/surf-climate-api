import { Auth } from '@src/services/auth';
import { authMiddleware } from '@src/middlewares/auth';

describe('Auth middleware', () => {
  it('should verify a JWT token and call th next middleware', () => {
    const jwtToken = Auth.generateToken({ data: 'fake' });

    const requestFake = {
      headers: {
        'x-access-token': jwtToken,
      },
    };
    const responseFake = {};
    const nextFake = jest.fn();

    authMiddleware(requestFake, responseFake, nextFake);
    expect(nextFake).toHaveBeenCalled();
  });

  it('should return UNAUTHORIZED if there is a problem on the token verification', () => {
    const requestFake = {
      headers: {
        'x-access-token': 'invalid-token',
      },
    };
    const sendMock = jest.fn();
    const responseFake = {
      status: jest.fn(() => ({
        send: sendMock,
      })),
    };
    const nextFake = jest.fn();

    // eslint-disable-next-line @typescript-eslint/ban-types
    authMiddleware(requestFake, responseFake as object, nextFake);

    expect(responseFake.status).toHaveBeenCalledWith(401);
    expect(sendMock).toHaveBeenCalledWith({
      code: 401,
      error: 'jwt malformed',
    });
  });

  it('should return UNAUTHORIZED middleware if theres no token', () => {
    const requestFake = {
      headers: {},
    };
    const sendMock = jest.fn();
    const responseFake = {
      status: jest.fn(() => ({
        send: sendMock,
      })),
    };
    const nextFake = jest.fn();

    // eslint-disable-next-line @typescript-eslint/ban-types
    authMiddleware(requestFake, responseFake as object, nextFake);

    expect(responseFake.status).toHaveBeenCalledWith(401);
    expect(sendMock).toHaveBeenCalledWith({
      code: 401,
      error: 'jwt must be provided',
    });
  });
});
