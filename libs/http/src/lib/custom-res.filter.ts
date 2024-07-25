import {ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus} from '@nestjs/common'
import { FastifyReply } from 'fastify';
import {JsonWebTokenError} from 'jsonwebtoken'


export const getStatusCode = <T>(exception: T): number => {
  return exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR
}


export const getErrorMessage = <T>(exception: T): string => {
  return exception instanceof HttpException ? exception['response']['message'] : String(exception)
}

@Catch()
export class GlobalExceptionFilter<T> implements ExceptionFilter {
  catch(exception: T, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<FastifyReply>()
    const statusCode = getStatusCode<T>(exception)
    const errorMessage = getErrorMessage<T>(exception)

    const error = Array.isArray(errorMessage) ? [errorMessage] : errorMessage
    if (statusCode === HttpStatus.UNAUTHORIZED || exception instanceof JsonWebTokenError) {
      response.status(statusCode).send({
        status: false,
        message: 'Unauthorized',
        error
      })
    }
    if (statusCode === HttpStatus.FORBIDDEN) {
      response.status(statusCode).send({
        status: false,
        message: 'Forbidden',
        error: error
      })
    }

    if (statusCode === HttpStatus.BAD_REQUEST) {
      response.status(statusCode).send({
        status: false,
        message: 'Bad Request',
        error: error
      })
    }

    response.status(statusCode).send({
      status: false,
      message: 'Server error',
    })
  }
}
