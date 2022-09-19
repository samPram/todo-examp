import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

@Catch()
export class ExceptionsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    console.log(exception);
    // In certain situations `httpAdapter` might not be available in the
    // constructor method, thus we should resolve it here.
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();

    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let status_message;

    switch (httpStatus) {
      case 404:
        status_message = 'Not Found';
        break;

      case 403:
        status_message = 'Forbidden';
        break;

      case 400:
        status_message = 'Bad Request';
        break;

      default:
        status_message = 'Internal Server Error';
        break;
    }

    const message =
      exception instanceof HttpException
        ? exception.message
        : 'Something went wrong!';

    const responseBody = {
      status: status_message,
      message: message,
      data: {},
    };

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
