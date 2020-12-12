import { Test, TestingModule } from "@nestjs/testing";
import { Browser, Page } from "puppeteer-core";
import { beginScrape } from "@scr-web/server-interfaces";
import { VSCOService } from "./vsco.service";

describe("VSCOService", () => {
	jest.setTimeout(15000);
	let service: VSCOService, browser: Browser, page: Page;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [VSCOService],
		}).compile();
		service = module.get<VSCOService>(VSCOService);
		const testConditions = await beginScrape("");
		browser = testConditions.browser;
		page = testConditions.page;
	});

	afterEach(async () => await browser.close());

	it("should be defined", () => expect(service).toBeDefined());

	it("scrapes darianvoisard/media/5a988983ec256c540d17960a & gets 1 MP4", async done => {
		try {
			const { url } = await service.getPostFile("darianvoisard/media/5a988983ec256c540d17960a", browser, page);
			// await browser.close();
			done();
			console.log(url);
			expect(url).toContain("https://");
			expect(url).toContain(".mp4");
			expect(url).toContain("vsco.co");
			expect(url).toContain("aws");
	} catch (error) {
		console.error(error.message);
	}
	});

	it("scrapes oliviamaxx/media/5fd3bed97cd68e4635abb619 & gets 1 JPEG", async done => {
		try {
			const { url } = await service.getPostFile("oliviamaxx/media/5fd3bed97cd68e4635abb619", browser, page);
			// await browser.close();
			done();
			console.log(url);
			expect(url).toContain("https://");
			expect(url).toContain(".jpg");
			expect(url).toContain("vsco.co");
			expect(url).toContain("aws");
	} catch (error) {
		console.error(error.message);
	}
	});
});
