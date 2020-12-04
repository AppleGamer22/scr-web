import { Injectable } from "@nestjs/common";
// import { userAgent } from "@scr-web/server-interfaces";
import { Browser, Page } from "puppeteer-core";

declare global {
	interface Window {
		_sharedData: any
		__additionalData: any
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
	async getPostFiles(id: string, browser: Browser, page: Page): Promise<{urls: string[], username: string}> {
		try {
			await page.goto(`https://www.instagram.com/p/${id}`, {waitUntil: "domcontentloaded"});
			if ((await page.$("div.error-container")) !== null) {
				await browser.close();
				throw new Error(`Failed to find post ${id}`);
			}
			const data = (await page.evaluate(() => window.__additionalData))[`/p/${id}/`].data.graphql.shortcode_media;
			const username = data.owner.username;
			var urls: string[] = [];
			if (data.edge_sidecar_to_children) {
				for (let edge of data.edge_sidecar_to_children.edges) {
					if (!edge.node.is_video) urls.push(edge.node.display_url);
					if (edge.node.is_video) urls.push(edge.node.video_url);
				}
			} else {
				if (!data.is_video) urls.push(data.display_url);
				if (data.is_video) urls.push(data.video_url);
			}
			return { urls, username };
		} catch (error) {
			console.error(error.message);
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
	async signIn(browser: Browser, page: Page, username: string, password: string): Promise<boolean> {
		try {
			// await page.setUserAgent(userAgent());
			await page.goto("https://www.instagram.com/accounts/login/");
			await page.waitForSelector(`input[name="username"]`);
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
			return false;
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