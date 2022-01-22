import { homedir } from "os";
import * as puppeteer from "puppeteer-core";
import { Request } from "express";
import { join } from "path";

/**
 * Finds Chrome user directory path
 * @param U_ID user's _id property
 * @returns Chrome user directory path
 */
export function chromeUserDataDirectory(U_ID: string): string {
	if (U_ID === "") return `${homedir()}/.scr-cli/`;
	if (process.env.ENV === "docker") return `/scr/users/${U_ID}/`;
	const userBrowserDirectory = join(process.env.USERS_PATH, U_ID);
	return userBrowserDirectory;
}

export interface ScrapeRequest extends Request {
	user?: {
		username: string,
		U_ID: string
	}
}
/**
 * Finds Chrome binary path
 * @returns Chrome binary path
 */
function chromeExecutable(): string {
	if (process.env.ENV === "docker") {
		return "/usr/bin/chromium-browser";
	} else {
		switch (process.platform) {
			case "darwin":
				return "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
			case "win32":
				return "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe";
			default:
				return "/opt/google/chrome/google-chrome";
				// or /usr/bin/google-chrome or /usr/lib/google-chrome
		}
	}
}
/**
 * Initiates Chrome for scraping
 * @param U_ID user's _id property
 * @param incognito private mode Boolean
 * @returns Puppeteer browser and page
 */
export async function beginScrape(U_ID: string, incognito = false): Promise<{browser: puppeteer.Browser, context: puppeteer.BrowserContext, page: puppeteer.Page}> {
	try {
		const args = [
			"--disable-gpu" ,
			"--no-sandbox",
			"--disable-dev-shm-usage",
			"--mute-audio",
			"--disable-blink-features=AutomationControlled"
		]
		// if (incognito) args.push("--incognito");
		const browser = await puppeteer.launch({
			// headless: false,
			devtools: false,
			defaultViewport: null,
			executablePath: chromeExecutable(),
			userDataDir: chromeUserDataDirectory(U_ID),
			args,
			ignoreDefaultArgs: ["--enable-automation"],
		});
		if (!incognito) {
			const [ page ] = await browser.pages();
			await page.evaluateOnNewDocument(() => delete Object.getPrototypeOf(navigator).webdriver);
			const userAgent = (await browser.userAgent()).replace("Headless", "");
			await page.setUserAgent(userAgent);
			// @ts-ignore
			// await page._client.send("Network.enable", {
			// 	maxResourceBufferSize: 1024 * 1204 * 100,
			// 	maxTotalBufferSize: 1024 * 1204 * 200,
			// });
			return {browser, page, context: null};
		} else {
			const context = await browser.createIncognitoBrowserContext();
			const page = await context.newPage();
			return { browser, context, page };
		}
	} catch (error) {
		throw new Error(error.message as string);
	}
}
