import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import * as puppeteer from "puppeteer";

@Injectable() export class InstagramService {
	async getPostFiles(id: string, browser: puppeteer.Browser, page: puppeteer.Page): Promise<string[]> {
		var urls: string[] = [];
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
				urls.push(...await page.$$eval("video.tWeCl", videos => videos.map(video => video.getAttribute("src"))));
				urls.push(...await page.$$eval("img.FFVAD", images => images.map(image => image.getAttribute("src"))));
				urls.push(...await page.$$eval(`meta[property="og:video"]`, metas => metas.map(meta => meta.getAttribute("content"))));
				// srcs.push(...await page.$$eval(`meta[property="og:image"]`, metas => metas.map(meta => meta.getAttribute("content")!)));
				await page.click("div.coreSpriteRightChevron");
				nextButtons = await page.$("div.coreSpriteRightChevron");
			} while (nextButtons !== null);
		} catch (error) {
			return [...(new Set<string>(this.cleanPayload(urls)))!];
		}
		return [...(new Set<string>(this.cleanPayload(urls)))!];
	}

	cleanPayload(urls: string[]): string[] {
		for (let i = 0; i < urls.length; i++) {
			const url = urls[i];
			if (url.includes("blob:")) urls.splice(i, 1);
		}
		return urls;
	}
}