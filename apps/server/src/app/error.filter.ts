import { ArgumentsHost, Catch, ExceptionFilter, HttpException, Logger, HttpStatus } from "@nestjs/common";
import { Request, Response } from "express";

@Catch() export class ErrorFilter implements ExceptionFilter {
	/**
	 * Catches exception, logs them, and returns an error HTTP response
	 * @param exception caught exception
	 * @param host arguments host
	 */
	catch(exception: unknown, host: ArgumentsHost) {
		const request = host.switchToHttp().getRequest<Request>();
		const response = host.switchToHttp().getResponse<Response>();
		const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
		const message = exception instanceof HttpException ? exception.message : "Unexpected internal server error.";
		Logger.error(`${status} ${request.method} ${request.url}`, "", "Error", true);
		return response.status(status).json(message);
	}
}
