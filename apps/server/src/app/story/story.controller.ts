import { Controller, Get, UseGuards, Param, Req, HttpStatus, HttpException } from "@nestjs/common";
import { beginScrape, ScrapeRequest } from "@scr-web/server-interfaces";
import { Request } from "express";
import { basename } from "path";
import { StoryService } from "./story.service";
import { AuthGuard } from "../auth/auth.guard";
import { HistoryService } from "../history/history.service";
import { StorageService } from "../storage/storage.service";
import { FileType } from "@scr-web/server-schemas";

@Controller("story") export class StoryController {
	constructor(
		private readonly storyService: StoryService,
		private readonly storageService: StorageService,
		private readonly historyService: HistoryService
	) {}
	/**
	 * handles HTTP response for story
	 * @param story story owner
	 * @param item story number
	 * @param request GET HTTP request
	 * @returns URL string array
	 */
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
			var paths: string[] = [];
			for (let url of urls) {
				const filename = `${story}_${basename(url)}`;
				await this.storageService.addFileFromURL(FileType.Story, story, filename, url);
				paths.push(`storage/highlight/${story}/${filename}`)
			}
			await this.historyService.addHistoryItem(U_ID, paths, FileType.Story, story, `${story}/${new Date().toISOString()}/${item}`);
			return paths;
		} catch (error) {
			const errorMessage = error.message as string;
			var errorCode: HttpStatus;
			if (errorMessage.includes("to find")) errorCode = HttpStatus.NOT_FOUND;
			if (errorMessage.includes("to process")) errorCode = HttpStatus.INTERNAL_SERVER_ERROR;
			throw new HttpException(error.message, errorCode);
		}
	}
}