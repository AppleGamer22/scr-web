import { Controller, Get, Param, HttpException, HttpStatus, Req, UseGuards } from "@nestjs/common";
import { beginScrape, ScrapeRequest } from "@scr-web/server-interfaces";
import { History } from "@scr-web/server-schemas";
import { FileType } from "@scr-web/client-schemas";
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
	): Promise<History> {
		const postAddress = `${user}/video/${post}`;
		try {
			const { U_ID } = (request as ScrapeRequest).user;
			const history = await this.historyService.getHistoryItemByPost(FileType.TikTok, post, U_ID);
			if (history) return history;
			const { browser, page } = await beginScrape(U_ID);
			const { urls, username, cookies } = await this.tiktokService.getPostFile(postAddress, browser, page);
			await browser.close();
			this.storageService.addFileFromURL(FileType.TikTok, username, `${post}.mp4`, urls[0], true, cookies);
			const path = `storage/tiktok/${username}/${post}.mp4`;
			return await this.historyService.addHistoryItem(U_ID, [path], FileType.TikTok, username, post);
		} catch (error) {
			const errorMessage = error.message as string;
			let errorCode: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
			if (errorMessage.includes("to find")) errorCode = HttpStatus.NOT_FOUND;
			if (errorMessage.includes("to process")) errorCode = HttpStatus.INTERNAL_SERVER_ERROR;
			throw new HttpException(error.message, errorCode);
		}
	}
}