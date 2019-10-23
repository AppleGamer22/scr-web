import { Injectable } from "@nestjs/common";
import { Browser, Page } from "puppeteer";

@Injectable() export class HighlightService {
	async getHighlightFile(highlight: string, item: number, browser: Browser, page: Page): Promise<string> {
		try {
			await page.goto(`https://www.instagram.com/stories/highlights/${highlight}`, {waitUntil: "domcontentloaded"});
			const potentialErrorMessage: string = await (await (await page.$("body"))!.getProperty("textContent")).jsonValue();
			if (potentialErrorMessage.includes("Oops, an error occurred.")) {
				await browser.close();
				throw new Error(`Failed to find highlight ${highlight}`);
			}
			for (var i = 0; i < item - 1; i += 1) {
				await page.waitForSelector("div.coreSpriteRightChevron", {visible: true});
				await page.click("div.coreSpriteRightChevron");
			}
			await page.waitForSelector("div.qbCDp", {visible: true});
			const videoURLs = await page.$$eval("video > source", sources => sources.map(source => source.getAttribute("src")));
			if (videoURLs) return videoURLs[0];
			const imageURLs = await page.$$eval("div.qbCDp > img", images => images.map(image => image.getAttribute("srcset")));
			if (imageURLs) return imageURLs[0].split(",")[0].split(" ")[0];
		} catch (error) {
			console.error(error.message);
			throw new Error(error.message);//"Failed to process requested highlight file."
		}
	}
}