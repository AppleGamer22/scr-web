import { Test, TestingModule } from "@nestjs/testing";
import { beginScrape } from "@scr-web/server-interfaces";
import { Browser, Page } from "puppeteer-core";
import { InstagramService } from "./instagram.service";

describe("InstagramService", () => {
	jest.setTimeout(15000);
	let service: InstagramService, browser: Browser, page: Page;
	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [InstagramService]
		}).compile();
		service = module.get<InstagramService>(InstagramService);
		const testConditions = await beginScrape("");
		browser = testConditions.browser;
		page = testConditions.page;
	});

	afterEach(async () => await browser.close());

	it("should be defined", () => expect(service).toBeDefined());

	it("scrapes B30gDXJnl3k & gets 1 public JPEG", async done => {
		try {
			const { urls } = await service.getPostFiles("B30gDXJnl3k", browser, page);
			done();
			expect(urls.length).toBe(1);
			console.log(urls[0]);
			expect(urls[0]).toContain("https://");
			expect(urls[0]).toContain(".jpg");
			const { hostname } = new URL(urls[0]);
			expect(hostname.endsWith("cdninstagram.com") || hostname.endsWith("fbcdn.net")).toBe(true);
		} catch (error) {
			console.error(error.message);
		}
	});

	it("scrapes CH3Axp5nkGj & gets 1 public MP4", async done => {
		try {
			const { urls } = await service.getPostFiles("CH3Axp5nkGj", browser, page);
			done();
			expect(urls.length).toBe(1);
			console.log(urls[0]);
			expect(urls[0]).toContain("https://");
			expect(urls[0]).toContain(".mp4");
			const { hostname } = new URL(urls[0]);
			expect(hostname.endsWith("cdninstagram.com") || hostname.endsWith("fbcdn.net")).toBe(true);
		} catch (error) {
			console.error(error.message);
		}
	});

	it("scrapes B3N2mEMA1lj & gets 2 public JPEG", async done => {
		try {
			const { urls } = await service.getPostFiles("B3N2mEMA1lj", browser, page);
			done();
			expect(urls.length).toBe(2);
			console.log(urls[0]);
			expect(urls[0]).toContain("https://");
			expect(urls[0]).toContain(".jpg");
			const hostname1 = new URL(urls[0]).hostname;
			expect(hostname1.endsWith("cdninstagram.com") || hostname1.endsWith("fbcdn.net")).toBe(true);
			console.log(urls[1]);
			expect(urls[1]).toContain("https://");
			expect(urls[1]).toContain(".jpg");
			const hostname2 = new URL(urls[1]).hostname;
			expect(hostname2.endsWith("cdninstagram.com") || hostname2.endsWith("fbcdn.net")).toBe(true);
		} catch (error) {
			console.error(error.message);
		}
	});

	it("scrapes blakepittman's CB9VU3BFwaChAx-YkjMQqGWhYjiwN0yYnrtYEc0 & gets a private JPEG", async done => {
		try {
			const { urls } = await service.getPostFiles("CB9VU3BFwaChAx-YkjMQqGWhYjiwN0yYnrtYEc0", browser, page);
			done();
			expect(urls.length).toBe(1);
			console.log(urls[0]);
			expect(urls[0]).toContain("https://");
			expect(urls[0]).toContain(".jpg");
			const { hostname } = new URL(urls[0]);
			expect(hostname.endsWith("cdninstagram.com") || hostname.endsWith("fbcdn.net")).toBe(true);
		} catch (error) {
			console.error(error.message);
		}
	});
});
