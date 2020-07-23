import { Injectable } from "@nestjs/common";
import { Browser, Page } from "puppeteer-core";

@Injectable() export class TikTokService {
	/**
	 * Scrapes TikTok post files
	 * @param id post ID
	 * @param browser Puppeteer browser
	 * @param page Puppeteer page
	 * @returns URL string array
	 */
	async getPostFile(id: string, browser: Browser, page: Page): Promise<string> {
		try {
			await page.goto(`https://tiktok.com/@${id}`, {waitUntil: "domcontentloaded"});
			if ((await page.$("div.error-page")) !== null) {
				await browser.close();
				throw new Error(`Failed to find post ${id}`);
			}
			await page.waitForSelector("h2.user-username", {visible: true});
			await page.waitForSelector("video", {visible: true});
			const videoURL = await page.$eval("video", video => video.getAttribute("src"));
			if (videoURL) return videoURL;
		} catch (error) {
			throw new Error(error.message);
		}
	}
}
