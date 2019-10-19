import { Controller, Patch, Body, Res, HttpStatus, HttpException } from "@nestjs/common";
import { Response } from "express";
import { AuthService } from "./auth.service";

@Controller("auth") export class AuthController {
	constructor(private readonly authService: AuthService) {}
	@Patch("sign_up/instagram") async signUpInstagram(
		@Body() body: {username: string, password: string},
		@Res() response: Response
	) {
		try {
			const user = await this.authService.signUpInstagram(body.username, body.password);
			return response.json(user).status(HttpStatus.CREATED);
		} catch (error) {
			const errorMessage = error.message as string;
			var errorCode = HttpStatus.INTERNAL_SERVER_ERROR;
			if (errorMessage.includes("already exists")) errorCode = HttpStatus.CONFLICT;
			throw new HttpException(error.message, errorCode);
		}
	}

	@Patch("sign_in/instagram") async signInInstagram(
		@Body() body: {username: string, password: string},
		@Res() response: Response
	) {
		try {
			const token = await this.authService.signInInstagram(body.username, body.password);
			return response.json({token}).status(HttpStatus.OK);
		} catch (error) {
			const errorMessage = error.message as string;
			var errorCode = HttpStatus.INTERNAL_SERVER_ERROR;
			if (errorMessage.includes("failed.")) errorCode = HttpStatus.UNAUTHORIZED;
			throw new HttpException(error.message, errorCode);
		}
	}
}