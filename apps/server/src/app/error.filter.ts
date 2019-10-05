import { ArgumentsHost, Catch, ExceptionFilter, HttpException, Logger, HttpStatus } from "@nestjs/common";
import { Request, Response } from "express";

@Catch() export class ErrorFilter implements ExceptionFilter {
	catch(exception: HttpException, host: ArgumentsHost) {
		const request = host.switchToHttp().getRequest<Request>();
		const response = host.switchToHttp().getResponse<Response>();
		Logger.error(`${HttpStatus.INTERNAL_SERVER_ERROR} ${request.method} ${request.url}`, "", "Error", true);
		return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json(exception.message);
	}
}
