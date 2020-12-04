import { Controller, Get, Param, HttpException, HttpStatus, Req, UseGuards } from "@nestjs/common";
import { beginScrape, ScrapeRequest } from "@scr-web/server-interfaces";
import { Request } from "express";
import { TikTokService } from "./tiktok.service";
import { HistoryService } from "../history/history.service";
import { StorageService } from "../storage/storage.service";
import { AuthGuard } from "../auth/auth.guard";

@Controller("tiktok") export class TikTokController {
	constructor(
		private readonly tiktokService: TikTokService,
		private readonly storageService: StorageService,
		private readonly historyService: HistoryService
	) {}
	/**
	 * handles HTTP response for tiktok
	 * @param user post owner
	 * @param post post ID
	 * @returns URL string array
	 */
	@Get(":user/:post") @UseGuards(AuthGuard) async getPostFiles(
		@Param("user") user: string,
		@Param("post") post: string,
		@Req() request: Request
	): Promise<string[]> {
		const postAddress = `${user}/video/${post}`;
		try {
			const { U_ID } = (request as ScrapeRequest).user;
			const history = await this.historyService.getHistoryItem(`tiktok/${user}/${post}`, U_ID);
			if (history) return history.urls;
			const { browser, page } = await beginScrape(U_ID);
			const { data, username } = await this.tiktokService.getPostFile(postAddress, browser, page);
			await browser.close();
			this.storageService.addFileFromBuffer("tiktok", user, `${post}.mp4`, data);
			const path = `storage/tiktok/${username}/${post}.mp4`;
			await this.historyService.addHistoryItem(`tiktok/${username}/${post}`, U_ID, { urls: [path], network: "tiktok" });
			return [path];
		} catch (error) {
			const errorMessage = error.message as string;
			var errorCode: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
			if (errorMessage.includes("to find")) errorCode = HttpStatus.NOT_FOUND;
			if (errorMessage.includes("to process")) errorCode = HttpStatus.INTERNAL_SERVER_ERROR;
			throw new HttpException(error.message, errorCode);
		}
	}
}