import { Test, TestingModule } from "@nestjs/testing";
import { beginScrape } from "@scr-gui/server-interfaces";
import { Browser, Page } from "puppeteer";
import { HighlightService } from "./highlight.service";

describe("HighlightService", () => {
	jest.setTimeout(15000);
	let service: HighlightService, browser: Browser, page: Page;
	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [HighlightService],
		}).compile();
		service = module.get<HighlightService>(HighlightService);
		const testConditions = await beginScrape("");
		browser = testConditions.browser;
		page = testConditions.page;
	});

	afterEach(async () => await browser.close());
	it("should be defined", () => expect(service).toBeDefined());
	it("scrapes 6th 17854701943592281 and gets a private MP4", async done => {
		try {
			const urls = await service.getHighlightFile("17854701943592281", 6, browser, page);
			done();
			expect(urls.length).toBe(2);
			console.log(urls[0]);
			expect(urls[0]).toContain("https://");
			expect(urls[0]).toContain(".jpg");
			expect(urls[0].includes("cdninstagram.com") || urls[0].includes("fbcdn.net")).toBe(true);
			console.log(urls[1]);
			expect(urls[1]).toContain("https://");
			expect(urls[1]).toContain(".mp4");
			expect(urls[1].includes("cdninstagram.com") || urls[1].includes("fbcdn.net")).toBe(true);
		} catch (error) { console.error(error.message); }
	});
	it("scrapes 4th 17912059153309881 and gets a public JPEG", async done => {
		try {
			const urls = await service.getHighlightFile("17912059153309881", 4, browser, page);
			done();
			console.log(urls[0]);
			expect(urls[0]).toContain("https://");
			expect(urls[0]).toContain(".jpg");
			expect(urls[0].includes("cdninstagram.com") || urls[0].includes("fbcdn.net")).toBe(true);
		} catch (error) { console.error(error.message); }
	});
});
