import { InternalError } from '@src/utils/errors/internal-error';

export class StormGlassReponseError extends InternalError {
  constructor(message: string) {
    const internalMessage =
      'Unexpected error returned by the StormGlass service';
    super(`${internalMessage}: ${message}`);
  }
}
