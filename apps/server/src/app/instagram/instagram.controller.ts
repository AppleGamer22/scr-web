import { Controller, Get, Param, HttpException, HttpStatus, Req, UseGuards } from "@nestjs/common";
import { beginScrape, ScrapeRequest } from "@scr-gui/server-interfaces";
import { Request } from "express";
import { AuthGuard } from "../auth/auth.guard";
import { InstagramService } from "./instagram.service";
import { HistoryService } from "../history/history.service";

@Controller("instagram") export class InstagramController {
	constructor(
		private readonly instagramService: InstagramService,
		private readonly historyService: HistoryService
	) {}
	@Get(":post") @UseGuards(AuthGuard) async getPostFiles(
		@Param("post") post: string,
		@Req() request: Request
	): Promise<string[]> {
		try {
			const U_ID = (request as ScrapeRequest).user.U_ID;
			const { browser, page } = await beginScrape(U_ID);
			const urls = await this.instagramService.getPostFiles(post, browser, page);
			await browser.close();
			await this.historyService.addHistoryItem(`instagram/${post}`, U_ID, { urls, network: "instagram" });
			return urls;
		} catch (error) {
			const errorMessage = error.message as string;
			var errorCode: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
			if (errorMessage.includes("to find")) errorCode = HttpStatus.NOT_FOUND;
			if (errorMessage.includes("to process")) errorCode = HttpStatus.INTERNAL_SERVER_ERROR;
			throw new HttpException(error.message, errorCode);
		}
	}
}
