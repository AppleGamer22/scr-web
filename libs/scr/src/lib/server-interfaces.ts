import { homedir } from "os";
import { config } from "dotenv";
import * as puppeteer from "puppeteer-core";
import { Request } from "express";
/**
 * Initializes server environment
 */
export function initEnvironment(): {JWT_SECRET: string, DATABASE_URL: string} {
	config({path: `${process.cwd()}/env.env`});
	const { JWT_SECRET, DATABASE_URL } = process.env;
	if (JWT_SECRET !== undefined && DATABASE_URL !== undefined) {
		return { JWT_SECRET, DATABASE_URL };
	} else {
		console.error("Some environment are not defined.");
		process.exit(1);
	}
}
/**
 * Finds Chrome user directory path
 * @param U_ID user's _id property
 * @returns Chrome user directory path
 */
export function chromeUserDataDirectory(U_ID: string): string {
	if (U_ID === "") return `${homedir()}/.scr-cli/`;
	if (process.env.ENV === "docker") return `/scr/users/${U_ID}/`;
	return `${process.cwd()}/users_dev/${U_ID}/`;
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
export async function beginScrape(U_ID: string, incognito = false): Promise<{browser: puppeteer.Browser, page: puppeteer.Page}> {
	try {
		const args = [
			"--disable-gpu" ,
			"--no-sandbox",
			"--disable-dev-shm-usage",
			"--mute-audio",
			"--disable-blink-features=AutomationControlled"
		]
		if (incognito) args.push("--incognito");
		const browser = await puppeteer.launch({
			headless: true,
			devtools: false,
			defaultViewport: null,
			executablePath: chromeExecutable(),
			userDataDir: chromeUserDataDirectory(U_ID),
			args,
			ignoreDefaultArgs: ["--enable-automation"],
		});
		const page = (await browser.pages())[0];
		await page.evaluateOnNewDocument(() => delete Object.getPrototypeOf(navigator).webdriver);
		// @ts-ignore
		await page._client.send("Network.enable", {
			maxResourceBufferSize: 1024 * 1204 * 100,
			maxTotalBufferSize: 1024 * 1204 * 200,
		});
		// await page.setUserAgent(userAgent());
		return { browser, page };
	} catch (error) {
		throw new Error(error.message as string);
	}
}
