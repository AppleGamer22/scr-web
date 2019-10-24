import { Controller, Get, Param, HttpException, HttpStatus, Req, UseGuards } from "@nestjs/common";
import { beginScrape, ScrapeRequest } from "@scr-gui/server-interfaces";
import { Request } from "express";
import { InstagramService } from "./instagram.service";
import { AuthGuard } from "../auth/auth.guard";

@Controller("instagram") export class InstagramController {
	constructor(private readonly instagramService: InstagramService) {}
	@Get(":post") @UseGuards(AuthGuard) async getPostFiles(
		@Param("post") post: string,
		@Req() request: Request
	): Promise<string[]> {
		try {
			const { browser, page } = await beginScrape((request as ScrapeRequest).user.U_ID as string);
			const urls = await this.instagramService.getPostFiles(post, browser, page);
			await browser.close();
			return urls;
		} catch (error) {
			const errorMessage = error.message as string;
			var errorCode: HttpStatus;
			if (errorMessage.includes("to find")) errorCode = HttpStatus.NOT_FOUND;
			if (errorMessage.includes("to process")) errorCode = HttpStatus.INTERNAL_SERVER_ERROR;
			throw new HttpException(error.message, errorCode);
		}
	}
}
