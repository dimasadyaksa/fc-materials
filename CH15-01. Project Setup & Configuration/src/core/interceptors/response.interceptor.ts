import {
  CallHandler,
  ExecutionContext,
  HttpException, HttpStatus,
  Injectable,
  NestInterceptor
} from "@nestjs/common";
import { Observable, map, catchError, throwError } from 'rxjs';
import { EntityNotFoundError } from "typeorm";

type Response<T> = {
  code: number;
  data: T;
  text: string;
};

type ResponseError = {
  code: number;
  kind: string;
  text: string;
  details?: any;
};

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<Response<T>> {
    return next
      .handle()
      .pipe(map(this.handleSuccess(context)), catchError(this.handleFailure));
  }

  handleSuccess(context: ExecutionContext): (data: T) => Response<T> {
    return (data: T) => {
      const http = context.switchToHttp();
      const code = http.getResponse().statusCode;
      return {
        code: code,
        data: data,
        text: code >= 400 ? 'failure' : 'success',
      };
    };
  }

  handleFailure(err: Error) {
    return throwError(() => {
      const respErr: ResponseError = {
        code: 500,
        kind: err.name,
        text: err.message,
      };
      if (err instanceof HttpException) {
        respErr.code = err.getStatus();
        const { message } = err.getResponse() as { message: any };
        if (message) {
          respErr.details = message;
        }
      }

      if (err instanceof EntityNotFoundError) {
        respErr.code = HttpStatus.NOT_FOUND;
        respErr.text = "Not found";
      }
      throw new HttpException(respErr, respErr.code);
    });
  }
}
