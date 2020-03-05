import { Test, TestingModule } from "@nestjs/testing";
import { Browser, Page } from "puppeteer";
import { beginScrape } from "@scr-web/server-interfaces";
import { TikTokService } from "./tiktok.service";

describe("TiktokService", () => {
	jest.setTimeout(15000);
	let service: TikTokService, browser: Browser, page: Page;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [TikTokService],
		}).compile();
		service = module.get<TikTokService>(TikTokService);
		const testConditions = await beginScrape("");
		browser = testConditions.browser;
		page = testConditions.page;
	});

	afterEach(async () => await browser.close());

	it("should be defined", () => expect(service).toBeDefined());

	it("scrapes  yaababyk's 6768910148997090566 & gets 1 public MP4", async done => {
		try {
			const url = (await service.getPostFile("yaababyk/video/6768910148997090566", browser, page));
			done();
			console.log(url);
			expect(url).toContain("https://v16.muscdn.com/");
		} catch (error) {
			console.error(error.message);
		}
	});
});
