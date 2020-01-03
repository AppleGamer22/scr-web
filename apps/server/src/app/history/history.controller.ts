import { ScrapeRequest } from "@scr-gui/server-interfaces";
import { History } from "@scr-gui/server-schemas";
import { Controller, Get, UseGuards, Req, HttpException, HttpStatus } from "@nestjs/common";
import { Request } from "express";
import { HistoryService } from "./history.service";
import { AuthGuard } from "../auth/auth.guard";

@Controller("history") export class HistoryController {
	constructor(private readonly historyService: HistoryService) {}
	@Get("") @UseGuards(AuthGuard) getHistory(@Req() request: Request): Promise<History[]> {
		try {
			const U_ID = (request as ScrapeRequest).user.U_ID;
			return this.historyService.getHistory(U_ID);
		} catch (error) {
			throw new
			HttpException("Failed to find history logs.", HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
}
