import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

// Catches every error and sends it in our Standard Error Response format
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error.';
    let errors: string[] = ['Something went wrong on the server.'];

    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      const body: any = exception.getResponse();
      const raw = typeof body === 'string' ? body : body.message;

      if (Array.isArray(raw)) {
        // validation errors come as a list
        message = 'Invalid request data.';
        errors = raw;
      } else {
        message = raw;
        errors = body.errors ?? [raw]; // use our own "errors" list if the code gave one
      }
    } else {
      console.error(exception); // unexpected error: show it in the terminal
    }

    response.status(statusCode).json({
      success: false,
      statusCode,
      message,
      errors,
      timestamp: new Date().toISOString(),
    });
  }
}