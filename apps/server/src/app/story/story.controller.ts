import { Controller, Get, UseGuards, Param, Req, HttpStatus, HttpException } from "@nestjs/common";
import { beginScrape, ScrapeRequest } from "@scr-gui/server-interfaces";
import { Request } from "express";
import { StoryService } from "./story.service";
import { AuthGuard } from "../auth/auth.guard";
import { HistoryService } from "../history/history.service";

@Controller("story") export class StoryController {
	constructor(
		private readonly storyService: StoryService,
		private readonly historyService: HistoryService
	) {}

	@Get(":story/:item") @UseGuards(AuthGuard) async getHighlightFile(
		@Param("story") story: string,
		@Param("item") item: number,
		@Req() request: Request
	): Promise<string[]> {
		try {
			const { U_ID } = (request as ScrapeRequest).user;
			const { browser, page } = await beginScrape(U_ID);
			const urls = await this.storyService.getStoryFile(story, item, browser, page);
			await browser.close();
			await this.historyService.addHistoryItem(`story/${story}/${item}`, U_ID, { urls, network: "instagram" });
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