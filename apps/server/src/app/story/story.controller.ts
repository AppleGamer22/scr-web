import { Controller, Get, UseGuards, Param, Req, HttpStatus, HttpException } from "@nestjs/common";
import { beginScrape, ScrapeRequest } from "@scr-gui/server-interfaces";
import { Request } from "express";
import { StoryService } from "./story.service";
import { AuthGuard } from "../auth/auth.guard";

@Controller("story") export class StoryController {
	constructor(private readonly storyService: StoryService) {}

	@Get(":story/:item") @UseGuards(AuthGuard) async getHighlightFile(
		@Param("story") story: string,
		@Param("item") item: number,
		@Req() request: Request
	): Promise<string[]> {
		try {
			const { browser, page } = await beginScrape((request as ScrapeRequest).user.U_ID);
			const url = await this.storyService.getStoryFile(story, item, browser, page);
			await browser.close();
			return [url];
		} catch (error) {
			const errorMessage = error.message as string;
			var errorCode: HttpStatus;
			if (errorMessage.includes("to find")) errorCode = HttpStatus.NOT_FOUND;
			if (errorMessage.includes("to process")) errorCode = HttpStatus.INTERNAL_SERVER_ERROR;
			throw new HttpException(error.message, errorCode);
		}
	}
}
