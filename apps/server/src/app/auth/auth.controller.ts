import { Controller, Patch, Body, Req, Res, HttpStatus, HttpException, UseGuards } from "@nestjs/common";
import { ScrapeRequest } from "@scr-gui/server-interfaces";
import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { AuthGuard } from "./auth.guard";

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
			const errorMessage = (error as Error).message;
			var errorCode = HttpStatus.INTERNAL_SERVER_ERROR;
			if (errorMessage.includes("already exists")) errorCode = HttpStatus.CONFLICT;
			throw new HttpException(errorMessage, errorCode);
		}
	}

	@Patch("sign_in/instagram") async signInInstagram(
		@Body() body: {username: string, password: string},
		@Res() response: Response
	): Promise<Response> {
		try {
			const token = await this.authService.signInInstagram(body.username, body.password);
			return response.json({token}).status(HttpStatus.OK);
		} catch (error) {
			const errorMessage = (error as Error).message;
			var errorCode = HttpStatus.INTERNAL_SERVER_ERROR;
			if (errorMessage.includes("failed.")) errorCode = HttpStatus.UNAUTHORIZED;
			throw new HttpException(errorMessage, errorCode);
		}
	}
	@Patch("sign_out/instagram") @UseGuards(AuthGuard) async signOutInstagram(
		@Req() request: Request,
		@Res() response: Response
	): Promise<Response> {
		try {
			const U_ID = (request as ScrapeRequest).user.U_ID;
			const { authenticated } = await this.authService.signOutInstagram(U_ID)
			if (!authenticated) return response.json({ status: authenticated }).status(HttpStatus.GONE);
		} catch (error) {
			const errorMessage = (error as Error).message;
			var errorCode = HttpStatus.INTERNAL_SERVER_ERROR;
			if (errorMessage.includes("failed.")) errorCode = HttpStatus.UNAUTHORIZED;
			throw new HttpException(errorMessage, errorCode);
		}
	}
}