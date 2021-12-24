import { Injectable } from "@nestjs/common";
import { writeFileSync } from "fs";
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
	},
	ItemModule: {
		[post: string]: {
			author: string,
			video: {
				downloadAddr: string
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
			if ((await page.$<HTMLDivElement>("div.error-page")) !== null) {
				await browser.close();
				throw new Error(`Failed to find post ${id}`);
			}
			// const data: TikTokPost = await page.evaluate(() => window["SIGI_STATE"]);
			// if (!data) {
			// 	await browser.close();
			// 	throw new Error(`Failed to find post ${id}`);
			// }
			const { sigi, data } = await page.evaluate(() => {
				const script = document.getElementById("__NEXT_DATA__");
				if (script != null) {
					const data = (document.getElementById("__NEXT_DATA__") as HTMLScriptElement).text;
					return {sigi: false, data};
				} else {
					return {sigi: true, data: JSON.stringify(window["SIGI_STATE"])};
				}
			});
			const json: TikTokPost = JSON.parse(data);
			// @ts-ignore
			const { cookies } = await page._client.send("Network.getAllCookies") as {cookies: Protocol.Network.Cookie[]};
			return {
				urls: ((): string[] => {
					if (!sigi) {
						return [json.props.pageProps.itemInfo.itemStruct.video.downloadAddr];
					} else {
						return [json.ItemModule[id.split("/")[2]].video.downloadAddr];
					}
				})(),
				username: ((): string => {
					if (!sigi) {
						return json.props.pageProps.itemInfo.itemStruct.author.uniqueId;
					} else {
						return json.ItemModule[id.split("/")[2]].author;
					}
				})(),
				cookies: cookies.filter(cookie => cookie.domain.includes("tiktok.com")).map(cookie => `${cookie.name}=${cookie.value}`).join("; ")
			};
		} catch (error) {
			console.error(error.message);
			await browser.close();
			throw new Error(error.message);
		}
	}
}
