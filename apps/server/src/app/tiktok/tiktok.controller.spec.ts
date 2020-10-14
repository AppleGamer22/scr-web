import { Test, TestingModule } from "@nestjs/testing";
import { TikTokController } from "./tiktok.controller";
import { TikTokService } from "./tiktok.service";
import { HistoryService } from "../history/history.service";
import { getModelToken } from "@nestjs/mongoose";

describe("Tiktok Controller", () => {
	let controller: TikTokController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [TikTokController],
			providers: [
				TikTokService,
				HistoryService,
				{
					provide: getModelToken("History"),
					useValue: (dto: History) => {
						// @ts-ignore
						dto = this.data;
						// @ts-ignore
						this.save  = async () => this.data;
					}
				}
			]
		}).compile();

		controller = module.get<TikTokController>(TikTokController);
	});

	it("should be defined", () => {
		expect(controller).toBeDefined();
	});
});
