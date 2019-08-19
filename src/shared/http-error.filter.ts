import {
  Catch,
  ExceptionFilter,
  ArgumentsHost,
  HttpException,
  Logger,
  HttpStatus,
} from '@nestjs/common';

@Catch()
export class HttpErrorFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();
    let status = exception.getStatus
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string =
      status !== HttpStatus.INTERNAL_SERVER_ERROR
        ? exception.message.error || exception.message || null
        : 'Internal server error';
    if (exception.name === 'EntityNotFound') {
      status = HttpStatus.NOT_FOUND;
      message = 'could not find this record.';
    }

    const errorResponse = {
      code: status,
      timestamp: new Date().toLocaleString(),
      path: request.url,
      method: request.method,
      message,
    };
    if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
      console.error(exception);
    }
    Logger.error(
      `${request.method} ${request.url}`,
      JSON.stringify(errorResponse),
      'ExceptionFilter',
    );
    response.status(status).json(errorResponse);
  }
}
