import { Injectable } from "@nestjs/common";
import { Browser, Page } from "puppeteer";

@Injectable() export class HighlightService {
	async getHighlightFile(highlight: string, item: number, browser: Browser, page: Page): Promise<string[]> {
		try {
			await page.goto(`https://www.instagram.com/stories/highlights/${highlight}`, {waitUntil: "domcontentloaded"});
			await page.waitForSelector("body", {visible: true});
			const potentialError = await page.$eval("body", body => (body as HTMLBodyElement).innerText);
			if (potentialError.includes("Oops, an error occurred.")) {
				await browser.close();
				throw new Error(`Failed to find highlight ${highlight}.`);
			}
			for (let i = 0; i < item - 1; i += 1) {
				await page.waitForSelector("div.coreSpriteRightChevron", {visible: true});
				await page.click("div.coreSpriteRightChevron");
			}
			await page.waitForSelector("div.qbCDp", {visible: true});
			var urls: string[] = [];
			const videoURLs = await page.$$eval("video > source", sources => {
				return sources.map(source => source.getAttribute("src"));
			});
			if (videoURLs) urls.push(videoURLs[0]);
			const imageURLs = await page.$$eval("div.qbCDp > img", images => {
				return images.map(image => image.getAttribute("srcset"));
			});
			if (imageURLs) urls.push(imageURLs[0].split(",")[0].split(" ")[0]);
			return urls
		} catch (error) {
			console.error(error.message);
			throw new Error(error.message);//"Failed to process requested highlight file."
		}
	}
}