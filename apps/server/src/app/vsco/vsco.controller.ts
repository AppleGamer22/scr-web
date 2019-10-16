import { Controller, Get, Param, HttpException, HttpStatus } from "@nestjs/common";
import { beginScrape } from "@scr-gui/server-interfaces";
import { VSCOService } from "./vsco.service";

@Controller("vsco") export class VSCOController {
	constructor(private readonly vscoService: VSCOService) {}
	@Get(":user/:post") async getPostFiles(@Param("user") user: string, @Param("post") post: string): Promise<string> {
		const postAddress = `${user}/media/${post}`;
		try {
			const {browser, page} = await beginScrape("");
			const url = await this.vscoService.getPostFiles(postAddress, browser, page);
			await browser.close();
			return url;
		} catch (error) {
			throw new HttpException(`Failed to find post ${postAddress}`, HttpStatus.NOT_FOUND);
			// throw new HttpException(error.message, HttpStatus.NOT_FOUND);
		}
	}
}
