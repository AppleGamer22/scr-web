import { Controller, Get, Param, HttpException, HttpStatus, Req, UseGuards } from "@nestjs/common";
import { beginScrape, ScrapeRequest } from "@scr-gui/server-interfaces";
import { Request } from "express";
import { InstagramService } from "./instagram.service";
import { AuthGuard } from "../auth/auth.guard";

@Controller("instagram") export class InstagramController {
	constructor(private readonly instagramService: InstagramService) {}
	@Get(":post") @UseGuards(AuthGuard) async getPostFiles(
		@Param("post") post: string,
		@Req() request: Request
	): Promise<string[]> {
		try {
			const {browser, page} = await beginScrape((request as ScrapeRequest).user.U_ID as string);
			const urls = await this.instagramService.getPostFiles(post, browser, page);
			await browser.close();
			return urls;
		} catch (error) {
			throw new HttpException(`Failed to find post ${post}`, HttpStatus.NOT_FOUND);
			// throw new HttpException(error.message, HttpStatus.NOT_FOUND);
		}
	}
}
