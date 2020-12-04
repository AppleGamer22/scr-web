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
	async getPostFile(id: string, browser: Browser, page: Page): Promise<{data: Buffer, username: string}> {
		try {
			var data: Buffer | undefined;
			page.on("response", async response => {
				if (response.url().includes("mp4") && response.ok()) {
					data = await response.buffer();
				}
			});
			await page.goto(`https://www.tiktok.com/@${id}`, {waitUntil: "domcontentloaded"});
			if ((await page.$("div.error-page")) !== null) {
				await browser.close();
				throw new Error(`Failed to find post ${id}`);
			}
			await page.waitForSelector("h3.author-uniqueId", {visible: true});
			const username = await page.evaluate(() => {
				const a = document.querySelectorAll("h3.author-uniqueId")[0] as HTMLHeadingElement;
				return a.innerText;
			});
			await page.waitForResponse(response => response.url().includes("mp4") && response.ok());
			await page.waitForSelector("video", {visible: true});
			await page.waitForTimeout(100);
			const duration = await page.evaluate(() => {
				const htmlVideo = document.querySelector("video") as HTMLVideoElement;
				return htmlVideo.duration * 1000;
			});
			await page.waitForTimeout(duration);
			return { data, username };
		} catch (error) {
			throw new Error(error.message);
		}
	}
}
