import { Injectable } from "@nestjs/common";
import { Browser, Page, Protocol } from "puppeteer-core";

interface TikTokPost {
	props: {
		pageProps: {
			itemInfo: {
				itemStruct: {
					author: {
						uniqueId: string
					},
					video: {
						downloadAddr: string
					}
				}
			}
		}
	}
}

@Injectable() export class TikTokService {
	/**
	 * Scrapes TikTok post files
	 * @param id post ID
	 * @param browser Puppeteer browser
	 * @param page Puppeteer page
	 * @returns URL string array
	 */
	async getPostFile(id: string, browser: Browser, page: Page): Promise<{urls: string[], username: string, cookies: string}> {
		try {
			await page.goto(`https://www.tiktok.com/@${id}`, {waitUntil: "domcontentloaded"});
			if ((await page.$("div.error-page")) !== null) {
				await browser.close();
				throw new Error(`Failed to find post ${id}`);
			}
			const script = await page.evaluate(() => (document.getElementById("__NEXT_DATA__") as HTMLScriptElement).text);
			const json: TikTokPost = JSON.parse(script);
			// @ts-ignore
			const { cookies } = await page._client.send("Network.getAllCookies") as {cookies: Protocol.Network.Cookie[]};
			return {
				urls: [json.props.pageProps.itemInfo.itemStruct.video.downloadAddr],
				username: json.props.pageProps.itemInfo.itemStruct.author.uniqueId,
				cookies: cookies.filter(cookie => cookie.domain.includes("tiktok.com")).map(cookie => `${cookie.name}=${cookie.value}`).join("; ")
			};
		} catch (error) {
			console.error(error.message);
			await browser.close();
			throw new Error(error.message);
		}
	}
}
