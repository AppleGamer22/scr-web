import { Controller, Patch, Body, Req, Res, HttpStatus, HttpException, UseGuards } from "@nestjs/common";
import { ApiHeader } from "@nestjs/swagger";
import { ScrapeRequest } from "@scr-web/server-interfaces";
import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { AuthGuard } from "./auth.guard";

@Controller("auth") export class AuthController {
	constructor(private readonly authService: AuthService) {}
	/**
	 * handles HTTP response for Instgram sign-up
	 * @param body PATCH request body
	 * @param response response PATCH request
	 * @returns HTTP response
	 */
	@Patch("sign_up/instagram") async signUpInstagram(
		@Body("username") username: string,
		@Body("password") password: string,
		@Res() response: Response
	): Promise<Response> {
		try {
			const user = await this.authService.signUpInstagram(username, password);
			return response.json(user).status(HttpStatus.CREATED);
		} catch (error) {
			const errorMessage = (error as Error).message;
			var errorCode = HttpStatus.INTERNAL_SERVER_ERROR;
			if (errorMessage.includes("already exists")) errorCode = HttpStatus.CONFLICT;
			throw new HttpException(errorMessage, errorCode);
		}
	}
	/**
	 * handles HTTP response for Instgram sign-in
	 * @param body PATCH request body
	 * @param response response PATCH request
	 * @returns HTTP response
	 */
	@Patch("sign_in/instagram") async signInInstagram(
		@Body("username") username: string,
		@Body("password") password: string,
		@Res() response: Response
	): Promise<Response> {
		try {
			const token = await this.authService.signInInstagram(username, password);
			return response.json({token}).status(HttpStatus.OK);
		} catch (error) {
			const errorMessage = (error as Error).message;
			var errorCode = HttpStatus.INTERNAL_SERVER_ERROR;
			if (errorMessage.includes("failed.")) errorCode = HttpStatus.UNAUTHORIZED;
			throw new HttpException(errorMessage, errorCode);
		}
	}
	/**
	 * handles HTTP response for Instgram sign-out
	 * @param body PATCH request body
	 * @param response response PATCH request
	 * @returns HTTP response
	 */
	@ApiHeader({
		name: "Authorization",
		allowEmptyValue: false
	}) @Patch("sign_out/instagram") @UseGuards(AuthGuard) async signOutInstagram(
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
	/**
	 * handles HTTP response for category edit
	 * @param request
	 * @param categories
	 * @param response
	 * @returns
	 */
	@ApiHeader({
		name: "Authorization",
		allowEmptyValue: false
	}) @Patch("categories") @UseGuards(AuthGuard) async editCategories(
		@Req() request: Request,
		@Body("categories") categories: string[],
		@Res() response: Response
	): Promise<Response> {
		try {
			const U_ID = (request as ScrapeRequest).user.U_ID;
			await this.authService.editCategories(U_ID, categories);
			return response.json(categories).status(HttpStatus.ACCEPTED);
		} catch (error) {
			const errorMessage = (error as Error).message;
			var errorCode = HttpStatus.INTERNAL_SERVER_ERROR;
			if (errorMessage.includes("failed.")) errorCode = HttpStatus.UNAUTHORIZED;
			throw new HttpException(errorMessage, errorCode);
		}
	}
	/**
	 * handles HTTP response for category retrieval
	 * @param request
	 * @param categories
	 * @param response
	 * @returns
	 */
	@ApiHeader({
		name: "Authorization",
		allowEmptyValue: false
	}) @Patch("categories") @UseGuards(AuthGuard) async getCategories(
		@Req() request: Request,
		@Res() response: Response
	): Promise<Response> {
		try {
			const U_ID = (request as ScrapeRequest).user.U_ID;
			const categories = await this.authService.getCategories(U_ID);
			return response.json(categories).status(HttpStatus.OK);
		} catch (error) {
			const errorMessage = (error as Error).message;
			var errorCode = HttpStatus.INTERNAL_SERVER_ERROR;
			if (errorMessage.includes("failed.")) errorCode = HttpStatus.UNAUTHORIZED;
			throw new HttpException(errorMessage, errorCode);
		}
	}
}