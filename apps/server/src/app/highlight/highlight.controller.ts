import { Controller, Get, Param, Req, HttpStatus, HttpException, UseGuards } from "@nestjs/common";
import { beginScrape, ScrapeRequest } from "@scr-web/server-interfaces";
import { Request } from "express";
import { basename } from "path";
import { HighlightService } from "./highlight.service";
import { AuthGuard } from "../auth/auth.guard";
import { HistoryService } from "../history/history.service";
import { StorageService } from "../storage/storage.service";

@Controller("highlight") export class HighlightController {
	constructor(
		private readonly highlightService: HighlightService,
		private readonly storageService: StorageService,
		private readonly historyService: HistoryService
	) {}
	/**
	 * handles HTTP response for highlight
	 * @param highlight highlight ID
	 * @param item highlight number
	 * @param request PATCH request
	 * @returns URL string array and username
	 */
	@Get(":highlight/:item") @UseGuards(AuthGuard) async getHighlightFile(
		@Param("highlight") highlight: string,
		@Param("item") item: number,
		@Req() request: Request
	): Promise<string[]> {
		try {
			const U_ID = (request as ScrapeRequest).user.U_ID;
			const { browser, page } = await beginScrape(U_ID);
			const { urls, username } = await this.highlightService.getHighlightFile(highlight, item, browser, page);
			await browser.close();
			var paths: string[] = [];
			for (let url of urls) {
				const filename = `${highlight}_${basename(url)}`;
				await this.storageService.addFileFromURL("highlight", username, filename, url);
				paths.push(`storage/highlight/${username}/${filename}`)
			}
			await this.historyService.addHistoryItem(U_ID, paths, "highlight", username, `${highlight}/${item}`);
			return paths;
		} catch (error) {
			const errorMessage = error.message as string;
			var errorCode: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
			if (errorMessage.includes("to find")) errorCode = HttpStatus.NOT_FOUND;
			if (errorMessage.includes("to process")) errorCode = HttpStatus.INTERNAL_SERVER_ERROR;
			throw new HttpException(error.message, errorCode);
		}
	}

}