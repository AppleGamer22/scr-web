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
			await page.waitForSelector("div.yn6BW > a", {visible: true});
			for (var i = 0; i < item - 1; i++) {
				await page.waitForSelector("div.coreSpriteRightChevron", {visible: true});
				await page.click("div.coreSpriteRightChevron");
			}
			if ((await page.$("div._7UhW9")) !== null) await page.click("div._7UhW9");
			// await page.keyboard.press("Space");
			var urls: string[] = [];
			await page.waitForSelector("div.qbCDp", {visible: true});
			const imageURL = (await page.$$eval("div.qbCDp > img", images => images.map(image => image.getAttribute("srcset"))))[0];
			if (imageURL) urls.push(imageURL.split(",")[0].split(" ")[0]);
			const videoURL = (await page.$$eval("div.qbCDp > video > source", sources => sources.map(source => source.getAttribute("src"))))[0];
			if (videoURL) urls.push(videoURL);
			return urls;
		} catch (error) {
			console.error(error.message);
			throw new Error("Failed to process requested story file.");
		}
	}
}