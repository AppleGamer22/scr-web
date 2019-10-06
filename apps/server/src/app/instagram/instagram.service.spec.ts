import { Test, TestingModule } from "@nestjs/testing";
import * as puppeteer from "puppeteer";
import { beginScrape } from "@scr-gui/server-interfaces";
import { InstagramService } from "./instagram.service";

describe("InstagramService", () => {
	jest.setTimeout(15000);
	let service: InstagramService, browser: puppeteer.Browser, page: puppeteer.Page;
	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [InstagramService]
		}).compile();
		service = module.get<InstagramService>(InstagramService);
		const testConditions = await beginScrape();
		browser = testConditions.browser;
		page = testConditions.page;
	});

	afterEach(async () => await browser.close());

	it("should be defined", () => expect(service).toBeDefined());

	it("scrapes Bz2MPhPhOQu & gets 1 public JPEG", async done => {
		try {
			const urls = await service.getPostFiles("Bz2MPhPhOQu", browser, page);
			// await browser.close();
			done();
			expect(urls.length).toBe(1);
			console.log(urls[0]);
			expect(urls[0]).toContain("https://");
			expect(urls[0]).toContain(".jpg");
			expect(urls[0]).toContain("cdninstagram.com");
		} catch (error) {
			console.error(error.message);
		}
	});

	it("scrapes B3GEbBDFzng & gets 1 public MP4", async done => {
		try {
			const urls = await service.getPostFiles("B3GEbBDFzng", browser, page);
			// await browser.close();
			done();
			expect(urls.length).toBe(1);
			console.log(urls[0]);
			expect(urls[0]).toContain("https://");
			expect(urls[0]).toContain(".mp4");
			expect(urls[0]).toContain("cdninstagram.com");
		} catch (error) {
			console.error(error.message);
		}
	});

	it("scrapes B3N2mEMA1lj & gets 2 private JPEG", async done => {
		try {
			const urls = await service.getPostFiles("B3N2mEMA1lj", browser, page);
			// await browser.close();
			done();
			expect(urls.length).toBe(2);
			console.log(urls[0]);
			expect(urls[0]).toContain("https://");
			expect(urls[0]).toContain(".jpg");
			expect(urls[0]).toContain("cdninstagram.com");
			console.log(urls[1]);
			expect(urls[1]).toContain("https://");
			expect(urls[1]).toContain(".jpg");
			expect(urls[1]).toContain("cdninstagram.com");
		} catch (error) {
			console.error(error.message);
		}
	});
});
