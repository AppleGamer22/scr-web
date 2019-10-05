import { Controller, Get, Param, HttpException, HttpStatus } from "@nestjs/common";
import { beginScrape } from "@scr-gui/server-interfaces";
import { InstagramService } from "./instagram.service";

@Controller("instagram") export class InstagramController {
	constructor(private instagramService: InstagramService) {}
	@Get(":id") async getPostFiles(@Param("id") id: string): Promise<string[]> {
		try {
			const {browser, page} = await beginScrape()
			const urls = await this.instagramService.getPostFiles(id, browser, page);
			await browser.close();
			return urls;
		} catch (error) {
			throw new HttpException(`Failed to find post ${id}`, HttpStatus.NOT_FOUND);
			// throw new HttpException(error.message, HttpStatus.NOT_FOUND);
		}
	}
}
