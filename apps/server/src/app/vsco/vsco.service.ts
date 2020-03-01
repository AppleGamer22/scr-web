import { Injectable } from "@nestjs/common";
import { Browser, Page } from "puppeteer";

@Injectable() export class VSCOService {
	async getPostFile(id: string, browser: Browser, page: Page): Promise<string> {
		try {
			await page.goto(`https://vsco.co/${id}`, {waitUntil: "domcontentloaded"});
			if ((await page.$("p.NotFound-heading")) !== null) {
				await browser.close();
				throw new Error(`Failed to find post ${id}`);
			}
			const imageURL = await page.$$eval(`meta[property="og:image"]`, metas => {
				return  metas.map(meta => meta.getAttribute("content"));
			});
			const videoURL = await page.$$eval(`meta[property="og:video"]`, metas => {
				return metas.map(meta => meta.getAttribute("content"));
			});
			if (videoURL[0]) return videoURL[0];
			if (imageURL[0]) return imageURL[0].split("?")[0];
		} catch (error) {
			throw new Error(error.message);
		}
	}
}
