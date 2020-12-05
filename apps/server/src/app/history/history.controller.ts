import { ScrapeRequest } from "@scr-web/server-interfaces";
import { History } from "@scr-web/server-schemas";
import { Controller, Get, UseGuards, Req, HttpException, HttpStatus, Patch, Body, Param } from "@nestjs/common";
import { Request } from "express";
import { HistoryService } from "./history.service";
import { AuthGuard } from "../auth/auth.guard";

@Controller("history") export class HistoryController {
	constructor(private readonly historyService: HistoryService) {}
	/**
	 * handles HTTP response for history
	 * @param request GET HTTP request
	 * @param type resource type
	 * @returns History items array
	 */
	@Get(":type") @UseGuards(AuthGuard) async getHistories(
		@Req() request: Request,
		@Param("type") type: "instagram" | "highlight" | "story" | "vsco" | "all"
	): Promise<History[]> {
		try {
			const U_ID = (request as ScrapeRequest).user.U_ID;
			if (type !== "all") {
				return (await this.historyService.getHistory(U_ID)).filter(history => history._id.includes(type));
			} else {
				return this.historyService.getHistory(U_ID);
			}
		} catch (error) {
			throw new
			HttpException("Failed to find history logs.", HttpStatus.INTERNAL_SERVER_ERROR);
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
		var { urls } = body.history;
		if (u_id === U_ID) {
			urls = urls.filter(url => url !== body.urlToDelete);
			if (urls.length === 0) {
				return this.historyService.deleteHistoryItem(_id);
			} else if (urls.length > 0) {
				return this.historyService.addHistoryItem(_id, U_ID, { urls, type, owner, post });
			}
		}
	}
}
