import { Injectable } from "@nestjs/common";
// import { userAgent } from "@scr-web/server-interfaces";
import { Browser, BrowserContext, Page } from "puppeteer-core";

interface InstagramPost {
	graphql: {
		shortcode_media: {
			display_url: string,
			video_url?: string,
			is_video: boolean,
			edge_sidecar_to_children?: {
				edges: {
					node: {
						display_url: string,
						video_url?: string,
						is_video: boolean,
					}
				}[]
			},
			owner: {
				username: string
			}
		}
	}
}

declare global {
	interface Window {
		_sharedData: {
			entry_data: {
				PostPage: InstagramPost[]
			}
		}
	}
}

@Injectable() export class InstagramService {
	/**
	 * Scrapes Instagram post files
	 * @param id post ID
	 * @param browser Puppeteer browser
	 * @param page Puppeteer page
	 * @returns URL string array and username
	 */
	async getPostFiles(id: string, browser: Browser | BrowserContext, page: Page, incognito: boolean): Promise<{urls: string[], username: string}> {
		try {
			await page.goto(`https://www.instagram.com/p/${id}`, {waitUntil: "load"});
			if ((await page.$("div.error-container")) !== null || (await page.content()).includes("Oops, an error occurred.")) {
				await browser.close();
				throw new Error(`Failed to find post ${id}`);
			}
			let json: InstagramPost;
			await page.waitForSelector("script:nth-child(15)");
			// await page.waitForTimeout(10000000)
			if (!incognito) {
				const script = await page.evaluate(() => {
					let scriptText = (document.querySelector("script:nth-child(15)") as HTMLScriptElement).text;
					if (!scriptText.startsWith("window.__additionalDataLoaded")) {
						scriptText = (document.querySelector("script:nth-child(16)") as HTMLScriptElement).text;
					}
					return scriptText;
				});
				json = JSON.parse(script.slice("window.__additionalDataLoaded(/p/".length + id.length + 4, -2)) as InstagramPost;
			} else {
				const sharedData = await page.evaluate(() => window._sharedData);
				json = sharedData.entry_data.PostPage[0];
			}
			const username = json.graphql.shortcode_media.owner.username;
			let urls: string[] = [];
			if (json.graphql.shortcode_media.edge_sidecar_to_children) {
				for (let edge of json.graphql.shortcode_media.edge_sidecar_to_children.edges) {
					if (!edge.node.is_video) urls.push(edge.node.display_url);
					if (edge.node.is_video) urls.push(edge.node.video_url);
				}
			} else {
				if (!json.graphql.shortcode_media.is_video) urls.push(json.graphql.shortcode_media.display_url);
				if (json.graphql.shortcode_media.is_video) urls.push(json.graphql.shortcode_media.video_url);
			}
			return { urls, username };
		} catch (error) {
			console.error(error.message);
			await browser.close();
			throw new Error(`Failed to process post ${id}`);
		}
	}

	/**
	 * Sign's-in to Instagram's website
	 * @param browser Puppeteer browser
	 * @param page Puppeteer page
	 * @param username user's username
	 * @param password user's password
	 * @returns success Boolean
	 */
	async signIn(browser: Browser | BrowserContext, page: Page, username: string, password: string): Promise<boolean> {
		try {
			await page.goto("https://www.instagram.com/accounts/login/", {waitUntil: "domcontentloaded"});
			await page.waitForSelector(`input[name="username"]`, {visible: true});
			await page.type(`input[name="username"]`, username);
			await page.type(`input[name="password"]`, password);
			await page.click(`button[type="submit"]`);
			await page.waitForResponse("https://www.instagram.com/accounts/onetap/?next=%2F");
			await page.waitForSelector("button.sqdOP")
			await page.click("button.sqdOP");
			await page.waitForResponse("https://www.instagram.com/");
			return true
		} catch (error) {
			console.error(error.message);
			await browser.close();
			throw new Error(error.message);
		}
	}
	/**
	 * Sign's-out from Instagram's website
	 * @param page Puppeteer page
	 * @param username user's username
	 * @returns success boolean
	 */
	async signOut(page: Page, username: string): Promise<boolean> {
		try {
			// await page.setUserAgent(userAgent());
			await page.goto(`https://www.instagram.com/${username}/`);
			// const profileButton = "#link_profile > a";
			// await page.waitForSelector(profileButton);
			// await page.click(profileButton);
			const settingsButton = "#react-root > section > main > div > header > section > div.nZSzR > div > button";
			await page.waitForSelector(settingsButton, {visible: true});
			await page.click(settingsButton);
			const logOutButton = "body > div.RnEpo.Yx5HN > div > div > div > button:nth-child(9)";
			await page.waitForSelector(logOutButton, {visible: true});
			await page.click(logOutButton);
			await page.waitForNavigation();
			return true;
		} catch (error) {
			console.error(error.message);
			return false;
		}
	}
}