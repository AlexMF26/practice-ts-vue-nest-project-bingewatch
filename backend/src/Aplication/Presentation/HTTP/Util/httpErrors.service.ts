import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';

export type ThrownError = Record<string, unknown> & Error;

@Injectable()
export class HTTPErrorsService {
  private readonly logger = new Logger(HTTPErrorsService.name);

  public mapToHTTPError(err: ThrownError) {
    this.logger.log('Mapping error');
    if ((err?.message ?? '') == '') {
      throw err;
    }
    const errorMessage = err.message.toLowerCase();
    if (errorMessage.includes('not found')) {
      throw new NotFoundException(err.message);
    }
    if (errorMessage.includes('invalid')) {
      throw new BadRequestException(err.message);
    }
    if (errorMessage.includes('not authorized')) {
      throw new UnauthorizedException(err.message);
    }
    if (errorMessage.includes('external')) {
      throw new ServiceUnavailableException(err.message);
    }
    if (
      errorMessage.includes('given') ||
      errorMessage.includes('already') ||
      errorMessage.includes('allowed')
    ) {
      throw new ConflictException(err.message);
    }
    this.logger.error(err.message);
    throw err;
  }
}
