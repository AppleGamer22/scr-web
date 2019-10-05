import { Controller, Get, Param, HttpException, HttpStatus } from "@nestjs/common";
import { InstagramService } from "./instagram.service";

@Controller("instagram") export class InstagramController {
	constructor(private instagramService: InstagramService) {}
	@Get(":id") async getPostFiles(@Param("id") id: string): Promise<string[]> {
		try {
			const {browser, page} = await this.instagramService.beginScrape()
			const urls = await this.instagramService.getPostFiles(id, browser, page);
			await browser.close();
			return urls;
		} catch (error) {
			throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
}
