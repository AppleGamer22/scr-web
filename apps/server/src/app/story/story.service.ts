import { Injectable } from "@nestjs/common";
import * as puppeteer from "puppeteer";

@Injectable() export class StoryService {
	async getStoryFile(user: string, item: number, browser: puppeteer.Browser, page: puppeteer.Page): Promise<string> {
		try {
			await page.goto(`https://www.instagram.com/${user}`);
			await page.goto(`https://www.instagram.com/stories/${user}`, {waitUntil: "domcontentloaded"});
			if ((await page.$("div.error-container")) !== null) {
				await browser.close();
				throw new Error(`Failed to find ${user}'s story feed.`);
			}
			for (var i = 0; i < item - 1; i += 1) {
				await page.waitForSelector("div.coreSpriteRightChevron", {visible: true});
				await page.click("div.coreSpriteRightChevron");
			}
			await page.waitForSelector("div.uL8Hv", {visible: true});
			await page.click("div.uL8Hv");
			var urls: string[] = [];
			await page.waitForSelector("div.qbCDp", {visible: true});
			// console.log(await page.content());
			const imageURLs = await page.$$eval("div.qbCDp > img", images => images.map(image => image.getAttribute("srcset")));
			if (imageURLs) return imageURLs[0].split(",")[0].split(" ")[0];
			const videoURLs = await page.$$eval("video > source", sources => sources.map(source => source.getAttribute("src")));
			if (videoURLs) return videoURLs[0];
		} catch (error) {
			console.error(error.message);
			throw new Error("Failed to process requested story file");
		}
	}
}