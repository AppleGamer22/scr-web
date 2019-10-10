import { ArgumentsHost, Catch, ExceptionFilter, HttpException, Logger } from "@nestjs/common";
import { Request, Response } from "express";

@Catch() export class ErrorFilter implements ExceptionFilter {
	catch(exception: HttpException, host: ArgumentsHost) {
		const request = host.switchToHttp().getRequest<Request>();
		const response = host.switchToHttp().getResponse<Response>();
		Logger.error(`${exception.getStatus()} ${request.method} ${request.url}`, "", "Error", true);
		return response.status(exception.getStatus()).json(exception.message);
	}
}
