import { Controller, Get, Param, HttpException, HttpStatus } from "@nestjs/common";
import { beginScrape } from "@scr-gui/server-interfaces";
import { VSCOService } from "./vsco.service";

@Controller("vsco") export class VSCOController {
	constructor(private readonly vscoService: VSCOService) {}
	@Get(":user/:post") async getPostFiles(@Param("user") user: string, @Param("post") post: string): Promise<string[]> {
		const postAddress = `${user}/media/${post}`;
		try {
			const { browser, page } = await beginScrape("");
			const url = await this.vscoService.getPostFiles(postAddress, browser, page);
			await browser.close();
			return [url];
		} catch (error) {
			const errorMessage = error.message as string;
			var errorCode: HttpStatus;
			if (errorMessage.includes("to find")) errorCode = HttpStatus.NOT_FOUND;
			if (errorMessage.includes("to process")) errorCode = HttpStatus.INTERNAL_SERVER_ERROR;
			throw new HttpException(error.message, errorCode);
		}
	}
}
