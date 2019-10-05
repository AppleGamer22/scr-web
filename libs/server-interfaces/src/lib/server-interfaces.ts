import { homedir } from "os";
import * as puppeteer from "puppeteer";
import { HttpStatus, HttpException } from "@nestjs/common";

export const chromeUserDataDirectory = `${homedir()}/.scr/`;

export function chromeExecutable(): string {
	switch (process.platform) {
		case "darwin":
			return "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
		case "win32":
			return "C:/Program\ Files\ (x86)/Google/Chrome/Application/chrome.exe";
		default:
			return puppeteer.executablePath();
			// or /usr/bin/google-chrome | /usr/lib/google-chrome
	}
}

export function userAgent(): string {
	switch (process.platform) {
		case "darwin":
			return "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.103 Safari/537.36";
		case "win32":
			return "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36";
		default:
			return "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu Chromium/71.0.3559.6 Chrome/71.0.3559.6 Safari/537.36";
	}
}

export async function beginScrape(): Promise<{browser: puppeteer.Browser, page: puppeteer.Page}> {
	try {
		const browser = await puppeteer.launch({
			headless: true,
			executablePath: puppeteer.executablePath(),//chromeExecutable(),
			userDataDir: chromeUserDataDirectory,
			args: ["--disable-gpu" , "--no-sandbox", "--disable-dev-shm-usage"]
		});
		const page = (await browser.pages())[0];
		await page.setUserAgent(userAgent());
		return {browser, page};
	} catch (error) {
		throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
	}
}
