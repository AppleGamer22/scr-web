import { homedir } from "os";
import { config } from "dotenv";
import * as puppeteer from "puppeteer";
import { Request } from "express";
import { Schema } from "mongoose";

export function initEnvironment(): {JWT_SECRET: string, DB_URL: string} {
	config({path: `${process.cwd()}/env.env`});
	const { JWT_SECRET, ENV } = process.env;
	const DB_URL = (ENV === "docker") ? "mongodb://database:27017/scr" : "mongodb://localhost:27017/scr";
	if (JWT_SECRET !== undefined) return { JWT_SECRET, DB_URL };
	if (JWT_SECRET === undefined) process.exit(1);
}

export function chromeUserDataDirectory(U_ID: string): string {
	if (U_ID === "") return `${homedir()}/.scr-cli/`;
	if (process.env.ENV === "docker") return `/scr/users/${U_ID}/`;
	return `${process.cwd()}/users_dev/${U_ID}/`;
}

export interface ScrapeRequest extends Request {
	user?: {
		username: string,
		U_ID: Schema.Types.ObjectId | string
	}
}

function chromeExecutable(): string {
	switch (process.platform) {
		case "darwin":
			return "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
		case "win32":
			return "C:/Program\ Files\ (x86)/Google/Chrome/Application/chrome.exe";
		default:
			if (process.env.ENV === "docker") return "/usr/bin/chromium-browser";
			return puppeteer.executablePath();
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

export async function beginScrape(U_ID: string): Promise<{browser: puppeteer.Browser, page: puppeteer.Page}> {
	try {
		const browser = await puppeteer.launch({
			headless: true,
			executablePath: chromeExecutable(),
			userDataDir: chromeUserDataDirectory(U_ID),
			args: [
				"--disable-gpu" ,
				"--no-sandbox",
				"--disable-dev-shm-usage",
				"--mute-audio"
			]
		});
		const page = (await browser.pages())[0];
		await page.setUserAgent(userAgent());
		return { browser, page };
	} catch (error) {
		throw new Error(error.message as string);
	}
}
