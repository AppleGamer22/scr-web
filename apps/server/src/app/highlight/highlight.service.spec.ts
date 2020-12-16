import { Test, TestingModule } from "@nestjs/testing";
import { beginScrape } from "@scr-web/server-interfaces";
import { Browser, Page } from "puppeteer-core";
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
	it("scrapes 16th 17844578911664043 and gets a private MP4", async done => {
		try {
			const { urls } = await service.getHighlightFile("17844578911664043", 16, browser, page);
			done();
			expect(urls.length).toBe(2);
			console.log(urls[0]);
			expect(urls[0]).toContain("https://");
			expect(urls[0]).toContain(".jpg");
			const hostname1 = new URL(urls[0]).hostname;
			expect(hostname1.endsWith("cdninstagram.com") || hostname1.endsWith("fbcdn.net")).toBe(true);
			console.log(urls[1]);
			expect(urls[1]).toContain("https://");
			expect(urls[1]).toContain(".mp4");
			const hostname2 = new URL(urls[1]).hostname;
			expect(hostname2.endsWith("cdninstagram.com") || hostname2.endsWith("fbcdn.net")).toBe(true);
		} catch (error) {
			console.error(error.message);
		}
	});
	it("scrapes 16th 17887560724381853 and gets a public JPEG", async done => {
		try {
			const { urls } = await service.getHighlightFile("17887560724381853", 16, browser, page);
			done();
			expect(urls.length).toBe(2);
			console.log(urls[0]);
			expect(urls[0]).toContain("https://");
			expect(urls[0]).toContain(".jpg");
			const hostname1 = new URL(urls[0]).hostname;
			expect(hostname1.endsWith("cdninstagram.com") || hostname1.endsWith("fbcdn.net")).toBe(true);
			console.log(urls[1]);
			expect(urls[1]).toContain("https://");
			expect(urls[1]).toContain(".mp4");
			const hostname2 = new URL(urls[1]).hostname;
			expect(hostname2.endsWith("cdninstagram.com") || hostname2.endsWith("fbcdn.net")).toBe(true);
		} catch (error) {
			console.error(error.message);
		}
	});
});
