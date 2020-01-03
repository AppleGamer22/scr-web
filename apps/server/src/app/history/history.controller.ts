import { ScrapeRequest } from "@scr-gui/server-interfaces";
import { History } from "@scr-gui/server-schemas";
import { Controller, Get, UseGuards, Req, HttpException, HttpStatus, Patch, Body } from "@nestjs/common";
import { Request } from "express";
import { HistoryService } from "./history.service";
import { AuthGuard } from "../auth/auth.guard";

@Controller("history") export class HistoryController {
	constructor(private readonly historyService: HistoryService) {}
	@Get("") @UseGuards(AuthGuard) getHistories(@Req() request: Request): Promise<History[]> {
		try {
			const U_ID = (request as ScrapeRequest).user.U_ID;
			return this.historyService.getHistory(U_ID);
		} catch (error) {
			throw new
			HttpException("Failed to find history logs.", HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
	@Patch("") @UseGuards(AuthGuard) editHistory(@Req() request: Request, @Body() body: {history: History, urlToDelete: string}): Promise<History> {
		const u_id = (request as ScrapeRequest).user.U_ID;
		const { U_ID, _id, network } = body.history;
		var { urls } = body.history;
		if (u_id === U_ID) {
			urls = urls.filter(url => url !== body.urlToDelete);
			if (urls.length === 0) {
				return this.historyService.deleteHistoryItem(_id);
			} else if (urls.length > 0) {
				return this.historyService.addHistoryItem(_id, U_ID, { urls, network });
			}
		}
	}
}
