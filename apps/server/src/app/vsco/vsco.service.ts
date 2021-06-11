import { Injectable } from "@nestjs/common";
import { Browser, Page } from "puppeteer-core";

interface VSCOPost {
	medias: {
		byId: {
			[post: string]: {
				media: {
					gridName: string,
					responsiveUrl: string,
					isVideo: boolean,
					videoUrl?: string
				}
			}
		}
	}
}

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
			await page.waitForSelector("body > script:nth-child(3)");
			const script = await page.evaluate(() => (document.querySelector("body > script:nth-child(3)") as HTMLScriptElement).text);
			const json: VSCOPost = JSON.parse(script.slice("window.__PRELOADED_STATE__ = ".length));
			const { media } = json.medias.byId[id.split("/")[2]];
			const username = media.gridName;
			var url = `https://${media.responsiveUrl}`;
			if (media.isVideo) {
				url = `https://${media.videoUrl}`;
			}
			return { url, username };
		} catch (error) {
			console.error(error.message);
			await browser.close();
			throw new Error(error.message);
		}
	}
}