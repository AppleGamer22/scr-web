import { Injectable } from "@nestjs/common";
import { Browser, Page } from "puppeteer-core";

@Injectable() export class VSCOService {
	/**
	 * Scrapes VSCO post files
	 * @param id post ID
	 * @param browser Puppeteer browser
	 * @param page Puppeteer page
	 * @returns URL string URL
	 */
	async getPostFile(id: string, browser: Browser, page: Page): Promise<{url: string, username: string}> {
		try {
			await page.goto(`https://vsco.co/${id}`, {waitUntil: "domcontentloaded"});
			if ((await page.$("p.NotFound-heading")) !== null) {
				await browser.close();
				throw new Error(`Failed to find post ${id}`);
			}
			await page.waitForSelector("a.css-9zfgas-UsernameLink.ejb7ykf0", {visible: true});
			const username = await page.evaluate(() => {
				const a = document.querySelector("a.css-9zfgas-UsernameLink.ejb7ykf0") as HTMLAnchorElement;
				return a.innerText;
			});
			const imageURL = await page.$$eval(`meta[property="og:image"]`, metas => {
				return  metas.map(meta => meta.getAttribute("content"));
			});
			const videoURL = await page.$$eval(`meta[property="og:video"]`, metas => {
				return metas.map(meta => meta.getAttribute("content"));
			});
			if (videoURL[0]) return {url: videoURL[0], username};
			if (imageURL[0]) return {url: imageURL[0].split("?")[0], username};
		} catch (error) {
			console.error(error.message);
			await browser.close();
			throw new Error(error.message);
		}
	}
}