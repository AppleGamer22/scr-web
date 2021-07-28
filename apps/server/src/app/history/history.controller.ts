import { ScrapeRequest } from "@scr-web/server-interfaces";
import { History } from "@scr-web/server-schemas";
import { FileType } from "@scr-web/client-schemas";
import { Controller, Get, UseGuards, Req, HttpException, HttpStatus, Patch, Body, Param } from "@nestjs/common";
import { Request } from "express";
import { HistoryService } from "./history.service";
import { AuthGuard } from "../auth/auth.guard";

@Controller("history") export class HistoryController {
	constructor(private readonly historyService: HistoryService) {}
	/**
	 * handles HTTP response for history
	 * @param request GET HTTP request
	 * @param type HTTP type parameter
	 * @param category HTTP category parameter
	 * @param owner HTTP owner parameter
	 * @returns History items array
	 */
	@Get(":type/:category/:owner") @UseGuards(AuthGuard) async getHistories(
		@Req() request: Request,
		@Param("type") type: FileType | "all",
		@Param("category") category: string,
		@Param("owner") owner: string
	): Promise<History[]> {
		try {
			const { U_ID } = (request as ScrapeRequest).user;
			return this.historyService.getFilteredHistory(U_ID, type, category, owner);
		} catch (error) {
			throw new HttpException("Failed to find history logs.", HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
	/**
	 * handles HTTP response for history editing, deletes requested URL from history
	 * @param request PATCH HTTP request
	 * @param body PATCH HTTP request body
	 * @returns Edited History object
	 */
	@Patch("") @UseGuards(AuthGuard) editHistory(@Req() request: Request, @Body() body: {history: History, urlToDelete: string}): Promise<History> {
		const u_id = (request as ScrapeRequest).user.U_ID;
		const { U_ID, _id, type, owner, post } = body.history;
		let { urls } = body.history;
		if (u_id === U_ID) {
			urls = urls.filter(url => url !== body.urlToDelete);
			if (urls.length === 0) {
				return this.historyService.deleteHistoryItem(_id);
			} else if (urls.length > 0) {
				return this.historyService.addHistoryItem(U_ID, urls, type, owner, post);
			}
		}
	}

	@Patch(":type/:owner/:post") @UseGuards(AuthGuard) async editHistoryCategory(
		@Req() request: Request,
		@Param("type") type: FileType,
		@Param("owner") owner: string,
		@Param("post") post: string,
		@Body("categories") categories: string[]
	): Promise<History> {
		// const { U_ID } = (request as ScrapeRequest).user;
		try {
			return await this.historyService.editHistoryCategories(type, owner, post, categories);
		} catch (error) {
			throw new HttpException(`Failed to edit post's ${post} categories.`, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
}
