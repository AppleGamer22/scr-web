import { Injectable } from "@nestjs/common";
import * as puppeteer from "puppeteer";

@Injectable() export class StoryService {
	async getStoryFile(user: string, item: number, browser: puppeteer.Browser, page: puppeteer.Page): Promise<string[]> {
		try {
			await page.goto(`https://www.instagram.com/${user}`);
			await page.goto(`https://www.instagram.com/stories/${user}`, {waitUntil: "domcontentloaded"});
			if ((await page.$("div.error-container")) !== null) {
				await browser.close();
				throw new Error(`Failed to find ${user}'s story feed.`);
			}
			await page.waitForSelector("div._7UhW9", {visible: true});
			await page.click("div._7UhW9");
			for (var i = 0; i < item - 1; i += 1) {
				await page.waitForSelector("div.coreSpriteRightChevron", {visible: true});
				await page.click("div.coreSpriteRightChevron");
			}
			await page.waitForSelector("div.uL8Hv", {visible: true});
			await page.click("div.uL8Hv");
			var urls: string[] = [];
			await page.waitForSelector("div.qbCDp", {visible: true});
			const imageURL = (await page.$$eval("div.qbCDp > img", images => images.map(image => image.getAttribute("srcset"))))[0];
			if (imageURL) urls.push(imageURL.split(",")[0].split(" ")[0]);
			const videoURL = (await page.$$eval("video > source", sources => sources.map(source => source.getAttribute("src"))))[0];
			if (videoURL) urls.push(videoURL);
			return urls;
		} catch (error) {
			console.error(error.message);
			throw new Error("Failed to process requested story file.");
		}
	}
}