import { Injectable } from "@nestjs/common";
import { Browser, Page } from "puppeteer-core";

@Injectable() export class StoryService {
	/**
	 * Scrapes Instagram story files
	 * @param user story owner
	 * @param item story number
	 * @param browser Puppeteer browser
	 * @param page Puppeteer page
	 * @returns URL string array
	 */
	async getStoryFile(user: string, item: number, browser: Browser, page: Page): Promise<string[]> {
		try {
			await page.goto(`https://www.instagram.com/${user}`);
			await page.goto(`https://www.instagram.com/stories/${user}`, {waitUntil: "domcontentloaded"});
			if ((await page.$("div.error-container")) !== null) {
				await browser.close();
				throw new Error(`Failed to find ${user}'s story feed.`);
			}
			await page.waitForSelector("header")
			if ((await page.$("button.sqdOP.L3NKy.y1rQx.cB_4K")) !== null) {
				await page.click("button.sqdOP.L3NKy.y1rQx.cB_4K");
			}
			for (let i = 0; i < item - 1; i++) {
				await page.waitForSelector("div.coreSpriteRightChevron", {visible: true});
				await page.click("div.coreSpriteRightChevron");
			}
			await page.waitForSelector("svg[aria-label='Pause']", {visible: true});
			await page.waitForTimeout(50);
			await page.click("svg[aria-label='Pause']");
			let urls: string[] = [];
			await page.waitForSelector("div.qbCDp", {visible: true});
			const imageURL = (await page.$$eval("img.y-yJ5", images => images.map(image => image.getAttribute("srcset"))))[0];
			if (imageURL) urls.push(imageURL.split(" ")[0]);
			const videoURL = (await page.$$eval("video > source", sources => sources.map(source => source.getAttribute("src"))))[0];
			if (videoURL) urls.push(videoURL);
			return urls;
		} catch (error) {
			console.error(error.message);
			await browser.close();
			throw new Error("Failed to process requested story file.");
		}
	}
}