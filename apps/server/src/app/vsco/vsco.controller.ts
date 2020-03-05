import { Controller, Get, Param, HttpException, HttpStatus } from "@nestjs/common";
import { beginScrape } from "@scr-web/server-interfaces";
import { VSCOService } from "./vsco.service";
import { HistoryService } from "../history/history.service";

@Controller("vsco") export class VSCOController {
	constructor(
		private readonly vscoService: VSCOService,
		private readonly historyService: HistoryService
	) {}
	@Get(":user/:post") async getPostFiles(@Param("user") user: string, @Param("post") post: string): Promise<string[]> {
		const postAddress = `${user}/media/${post}`;
		try {
			const { browser, page } = await beginScrape("");
			const url = await this.vscoService.getPostFile(postAddress, browser, page);
			await browser.close();
			await this.historyService.addHistoryItem(`vsco/${user}/${post}`, "public", { urls: [url], network: "vsco" });
			return [url];
		} catch (error) {
			const errorMessage = error.message as string;
			var errorCode: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
			if (errorMessage.includes("to find")) errorCode = HttpStatus.NOT_FOUND;
			if (errorMessage.includes("to process")) errorCode = HttpStatus.INTERNAL_SERVER_ERROR;
			throw new HttpException(error.message, errorCode);
		}
	}
}
