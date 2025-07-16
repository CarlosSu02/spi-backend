import {
  CallHandler,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { format } from 'date-fns';
import { catchError, map, Observable, throwError } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { RESPONSE_MESSAGE_METADATA } from '../decorators';
import { Prisma } from '@prisma/client';

export interface IResponse<T> {
  status: boolean;
  statusCode: number;
  path: string;
  message: string;
  result: T;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
  };
  timestamp: string;
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, IResponse<T>>
{
  private readonly METHOD_TRANSLATIONS: Record<string, string> = {
    POST: 'crear',
    PUT: 'actualizar',
    PATCH: 'modificar',
    DELETE: 'eliminar',
    GET: 'obtener',
  };

  constructor(private reflector: Reflector) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<IResponse<T>> {
    return next.handle().pipe(
      map((res: unknown) => this.responseHandler(res, context)),
      catchError((err: HttpException | Prisma.PrismaClientKnownRequestError) =>
        throwError(() => this.errorHandler(err, context)),
      ),
    );
  }

  errorHandler(
    exception: HttpException | Prisma.PrismaClientKnownRequestError,
    context: ExecutionContext,
  ) {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // const status =
    //   exception instanceof HttpException
    //     ? exception.getStatus()
    //     : exception instanceof Prisma.PrismaClientKnownRequestError
    //       ? GetPrismaStatus(exception.code)
    //       : HttpStatus.INTERNAL_SERVER_ERROR;

    const [status, message] =
      exception instanceof HttpException // if
        ? [exception.getStatus(), exception.message]
        : exception instanceof Prisma.PrismaClientKnownRequestError // elseif
          ? this.getPrismaError(request, exception)
          : [HttpStatus.INTERNAL_SERVER_ERROR, 'Error internal server.'];

    interface IHEWithMessage extends HttpException {
      message: string;
    }

    const resultMessage =
      exception instanceof HttpException && exception.getResponse()
        ? (exception.getResponse() as IHEWithMessage).message === message
          ? []
          : (exception.getResponse() as IHEWithMessage).message
        : [];

    const uniqueMessages = [...new Set(resultMessage)]; // Eliminar duplicados

    response.status(status).json({
      status: false,
      statusCode: status,
      path: request.url,
      message,
      // result:
      // exception instanceof HttpException &&
      // Object.entries(exception).includes('response') &&
      // exception.reponse,
      // result: exception instanceof HttpException && exception.getResponse(),
      result: uniqueMessages,
      timestamp: format(new Date().toISOString(), 'yyyy-MM-dd HH:mm:ss'),
    });
  }

  responseHandler(res: any, context: ExecutionContext) {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const message =
      this.reflector.get<string>(
        RESPONSE_MESSAGE_METADATA,
        context.getHandler(),
      ) || 'success';

    return {
      status: true,
      statusCode: response.statusCode,
      path: request.url,
      message,
      result: res,
      timestamp: format(new Date().toISOString(), 'yyyy-MM-dd HH:mm:ss'),
    };
  }

  getPrismaError(
    request: Request,
    exception: Prisma.PrismaClientKnownRequestError,
  ): [number, string] {
    const { modelName, target } =
      (exception.meta! as {
        modelName: string;
        target: string[];
      }) || {};

    switch (exception.code) {
      case 'P2002': {
        const status = HttpStatus.CONFLICT;
        const fields = Array.isArray(target) ? target.join(', ') : target;

        const message = `El valor proporcionado para <${fields}> ya está en uso. Por favor, elige un nombre diferente para ${this.METHOD_TRANSLATIONS[request.method]} el registro de <${modelName}>`;

        // break;
        return [status, message];
      }

      case 'P2025': {
        const status = HttpStatus.NOT_FOUND;
        const message = `No se encontraron registros con el id <${
          request.params['id']
        }> en el modelo <${modelName}>.`;

        // break;
        return [status, message];
      }

      case 'P2003': {
        return [
          HttpStatus.BAD_REQUEST,
          `No se puede ${this.METHOD_TRANSLATIONS[request.method] || 'procesar'} el ${modelName} debido a una restricción de clave externa`,
        ];
      }

      default:
        // break;
        return [HttpStatus.INTERNAL_SERVER_ERROR, exception.message];
    }
  }
}
