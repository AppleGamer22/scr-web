import { Controller, Get, Param, HttpException, HttpStatus, Req, UseGuards } from "@nestjs/common";
import { beginScrape, ScrapeRequest } from "@scr-web/server-interfaces";
import { Request } from "express";
import { basename } from "path";
import { HistoryService } from "../history/history.service";
import { StorageService } from "../storage/storage.service";
import { VSCOService } from "./vsco.service";
import { AuthGuard } from "../auth/auth.guard";
import { FileType } from "@scr-web/server-schemas";

@Controller("vsco") export class VSCOController {
	constructor(
		private readonly vscoService: VSCOService,
		private readonly storageService: StorageService,
		private readonly historyService: HistoryService
	) {}
	/**
	 * handles HTTP response for vsco
	 * @param user post owner
	 * @param post post ID
	 * @returns URL string array
	 */
	@Get(":user/:post") @UseGuards(AuthGuard) async getPostFiles(
		@Param("user") user: string,
		@Param("post") post: string,
		@Req() request: Request
	): Promise<string[]> {
		const postAddress = `${user}/media/${post}`;
		try {
			const { U_ID } = (request as ScrapeRequest).user;
			const history = await this.historyService.getHistoryItemByPost(FileType.VSCO, post, U_ID);
			if (history) return history.urls;
			const { browser, page } = await beginScrape(U_ID);
			const { url, username } = await this.vscoService.getPostFile(postAddress, browser, page);
			await browser.close();
			const filename = `${post}_${basename(url)}`;
			await this.storageService.addFileFromURL(FileType.VSCO, username, filename, url);
			const path = `storage/vsco/${username}/${filename}`;
			await this.historyService.addHistoryItem(U_ID, [path], FileType.VSCO, username, post);
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
