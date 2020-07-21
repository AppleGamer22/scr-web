import { CallHandler, ExecutionContext, Injectable, NestInterceptor, Logger } from "@nestjs/common";
import { Request, Response } from "express";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";

@Injectable() export class LogsInterceptor implements NestInterceptor {
	/**
	 * Logs successful requests
	 * @param context execution context
	 * @param next next handler
	 */
	intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
		const now = Date.now();
		const request = context.switchToHttp().getRequest<Request>();
		const response = context.switchToHttp().getResponse<Response>();
		const message = `${response.statusCode} ${request.method} ${request.url} ${Date.now() - now}ms`;
		return next.handle().pipe(tap(() => Logger.log(message, context.getClass().name)));
	}
}
