import { Controller, Get, Param, Req, HttpStatus, HttpException, UseGuards } from "@nestjs/common";
import { beginScrape, ScrapeRequest } from "@scr-web/server-interfaces";
import { Request } from "express";
import { HighlightService } from "./highlight.service";
import { AuthGuard } from "../auth/auth.guard";
import { HistoryService } from "../history/history.service";

@Controller("highlight") export class HighlightController {
	constructor(
		private readonly highlightService: HighlightService,
		private readonly historyService: HistoryService
	) {}

	@Get(":highlight/:item") @UseGuards(AuthGuard) async getHighlightFile(
		@Param("highlight") highlight: string,
		@Param("item") item: number,
		@Req() request: Request
	): Promise<string[]> {
		try {
			const U_ID = (request as ScrapeRequest).user.U_ID;
			const { browser, page } = await beginScrape(U_ID);
			const urls = await this.highlightService.getHighlightFile(highlight, item, browser, page);
			await browser.close();
			await this.historyService.addHistoryItem(`highlight/${highlight}/${item}`, U_ID, { urls, network: "instagram" });
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