import { Controller, Get, Param, Req, HttpStatus, HttpException, UseGuards } from "@nestjs/common";
import { beginScrape, ScrapeRequest } from "@scr-gui/server-interfaces";
import { Request } from "express";
import { HighlightService } from "./highlight.service";
import { AuthGuard } from "../auth/auth.guard";

@Controller("highlight") export class HighlightController {
	constructor(private readonly highlightService: HighlightService) {}

	@Get(":highlight/:item") @UseGuards(AuthGuard) async getHighlightFile(
		@Param("highlight") highlight: string,
		@Param("item") item: string,
		@Req() request: Request
	): Promise<string> {
		try {
			const { browser, page } = await beginScrape((request as ScrapeRequest).user.U_ID as string);
			const url = await this.highlightService.getHighlightFile(highlight, Number(item), browser, page);
			await browser.close();
			return url;
		} catch (error) {
			const errorMessage = error.message as string;
			var errorCode: HttpStatus;
			if (errorMessage.includes("to find")) errorCode = HttpStatus.NOT_FOUND;
			if (errorMessage.includes("to process")) errorCode = HttpStatus.INTERNAL_SERVER_ERROR;
			throw new HttpException(error.message, errorCode);
		}
	}

}