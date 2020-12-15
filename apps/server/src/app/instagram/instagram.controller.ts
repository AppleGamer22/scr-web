import { Controller, Get, Param, HttpException, HttpStatus, Req, UseGuards } from "@nestjs/common";
import { beginScrape, ScrapeRequest } from "@scr-web/server-interfaces";
import { Request } from "express";
import { basename } from "path";
import { AuthGuard } from "../auth/auth.guard";
import { InstagramService } from "./instagram.service";
import { HistoryService } from "../history/history.service";
import { StorageService } from "../storage/storage.service";
import { FileType } from "@scr-web/server-schemas";

@Controller("instagram") export class InstagramController {
	constructor(
		private readonly instagramService: InstagramService,
		private readonly storageService: StorageService,
		private readonly historyService: HistoryService
	) {}
	/**
	 * handles HTTP response for instagram
	 * @param post post ID
	 * @param request GET HTTP request
	 * @returns URL string array
	 */
	@Get(":post") @UseGuards(AuthGuard) async getPostFiles(
		@Param("post") post: string,
		@Req() request: Request
	): Promise<string[]> {
		try {
			const { U_ID } = (request as ScrapeRequest).user;
			const history = await this.historyService.getHistoryItemByPost(post, U_ID);
			if (history) return history.urls;
			const { browser, page } = await beginScrape(U_ID);
			const { urls, username } = await this.instagramService.getPostFiles(post, browser, page);
			await browser.close();
			var paths: string[] = [];
			for (let url of urls) {
				const filename = `${post}_${basename(url).split("?")[0]}`;
				await this.storageService.addFileFromURL(FileType.Instagram, username, filename, url);
				paths.push(`storage/instagram/${username}/${filename}`);
			}
			await this.historyService.addHistoryItem(U_ID, paths, FileType.Instagram, username, post);
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
