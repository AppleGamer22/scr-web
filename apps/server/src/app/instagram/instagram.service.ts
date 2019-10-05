import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import * as puppeteer from "puppeteer";
import { chromeUserDataDirectory, userAgent, chromeExecutable } from "@scr-gui/server-interfaces";

@Injectable() export class InstagramService {
	constructor() {}

	async beginScrape(): Promise<{browser: puppeteer.Browser, page: puppeteer.Page}> {
		try {
			const browser = await puppeteer.launch({
				headless: true,
				executablePath: chromeExecutable(),
				userDataDir: chromeUserDataDirectory,
				args: ["--disable-gpu", "--no-sandbox", "--disable-dev-shm-usage"]
			});
			const page = (await browser.pages())[0];
			await page.setUserAgent(userAgent());
			return {browser, page};
		} catch (error) {
			throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	async getPostFiles(id: string, browser: puppeteer.Browser, page: puppeteer.Page): Promise<string[]> {
		var srcs: string[] = [];
		try {
			await page.goto(`https://www.instagram.com/p/${id}`, {waitUntil: "domcontentloaded"});
			if ((await page.$("div.error-container")) !== null) {
				console.error(`Failed to find post ${id}`);
				await browser.close();
				throw new HttpException(`Failed to find post ${id}`, HttpStatus.NOT_FOUND);
			}
			await page.waitForSelector("div.ZyFrc", {visible: true});
			let nextButtons = await page.$("div.coreSpriteRightChevron");
			do {
				// const videosDuplicates = await page.$$eval("video.tWeCl", videos => videos.map(video => video.getAttribute("src")));
				const imagesDuplicates = await page.$$eval("img.FFVAD", images => images.map(image => image.getAttribute("src")));
				srcs.push(...await page.$$eval(`meta[property="og:video"]`, metas => metas.map(meta => meta.getAttribute("content")!)));
				// srcs.push(...await page.$$eval(`meta[property="og:image"]`, metas => metas.map(meta => meta.getAttribute("content")!)));
				imagesDuplicates.forEach(duplicate => { if (duplicate) srcs.push(duplicate); });
				// videosDuplicates.forEach(duplicate => { if (duplicate) srcs.push(duplicate); });
				await page.click("div.coreSpriteRightChevron");
				nextButtons = await page.$("div.coreSpriteRightChevron");
			} while (nextButtons !== null);
		} catch (error) {
			return [...(new Set<string>(srcs))!];
		}
		return [...(new Set<string>(srcs))!];
	}
}