import { Injectable } from "@nestjs/common";
import { Browser, Page } from "puppeteer-core";

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
			// await page.waitForSelector("div._7UhW9", {visible: true});
			// await page.click("div._7UhW9");
			for (var i = 0; i < item - 1; i += 1) {
				await page.waitForSelector("div.coreSpriteRightChevron", {visible: true});
				await page.click("div.coreSpriteRightChevron");
			}
			if ((await page.$("div._7UhW9")) !== null) await page.click("div._7UhW9");
			await page.keyboard.press("Space");
			var urls: string[] = [];
			await page.waitForSelector("div.qbCDp", {visible: true});
			const imageURL = (await page.$$eval("div.qbCDp > img", images => images.map(image => image.getAttribute("srcset"))))[0];
			if (imageURL) urls.push(imageURL.split(",")[0].split(" ")[0]);
			const videoURL = (await page.$$eval("div.qbCDp > video > source", sources => sources.map(source => source.getAttribute("src"))))[0];
			if (videoURL) urls.push(videoURL);
			return urls;
		} catch (error) {
			throw new Error(error.message as string);
		}
	}
}