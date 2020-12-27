import { Injectable } from "@nestjs/common";
import { Browser, Page } from "puppeteer-core";

@Injectable() export class HighlightService {
	/**
	 * Scrapes Instagram highlight files
	 * @param highlight highlight ID
	 * @param item highlight number
	 * @param browser Puppeteer browser
	 * @param page Puppeteer page
	 * @returns URL string array
	 */
	async getHighlightFile(highlight: string, item: number, browser: Browser, page: Page): Promise<{urls: string[], username: string}> {
		try {
			await page.goto(`https://www.instagram.com/stories/highlights/${highlight}`, {waitUntil: "domcontentloaded"});
			await page.waitForSelector("body", {visible: true});
			const potentialError = await page.$eval("body", body => (body as HTMLBodyElement).innerText);
			if (potentialError.includes("Oops, an error occurred.")) {
				await browser.close();
				throw new Error(`Failed to find highlight ${highlight}.`);
			}
			if (await page.waitForSelector("button._42FBe")) {
				await page.click("button._42FBe")
			}
			await page.waitForSelector("a.FPmhX", {visible: true});
			const username = await page.evaluate(() => {
				const a = document.querySelector("a.FPmhX") as HTMLAnchorElement;
				return a.innerText;
			});
			for (var i = 0; i < item - 1; i += 1) {
				await page.waitForSelector("div.coreSpriteRightChevron", {visible: true});
				await page.click("div.coreSpriteRightChevron");
			}
			await page.waitForSelector("svg[aria-label='Pause']", {visible: true});
			await page.waitForTimeout(50);
			await page.click("svg[aria-label='Pause']");
			var urls: string[] = [];
			await page.waitForSelector("div.qbCDp", {visible: true});
			const imageURL = (await page.$$eval("img.y-yJ5", images => images.map(image => image.getAttribute("srcset"))))[0];
			if (imageURL) urls.push(imageURL.split(" ")[0]);
			const videoURL = (await page.$$eval("video > source", sources => sources.map(source => source.getAttribute("src"))))[0];
			if (videoURL) urls.push(videoURL);
			return { urls, username };
		} catch (error) {
			throw new Error(error.message as string);
		}
	}
}