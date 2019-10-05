import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import * as puppeteer from "puppeteer";

@Injectable() export class VSCOService {
	async getPostFiles(id: string, browser: puppeteer.Browser, page: puppeteer.Page): Promise<string> {
		try {
			await page.goto(`https://vsco.co/${id}`, {waitUntil: "domcontentloaded"});
			const imageURL = await page.$$eval(`meta[property="og:image"]`, metas => metas.map(meta => meta.getAttribute("content")));
			const videoURL = await page.$$eval(`meta[property="og:video"]`, metas => metas.map(meta => meta.getAttribute("content")));
			await page.goto(`https://vsco.co/${id}`, {waitUntil: "domcontentloaded"});
			if (videoURL[0]) return videoURL[0];
			if (imageURL[0]) return imageURL[0].split("?")[0];
		} catch (error) { console.error(error.message); }
	}
}
