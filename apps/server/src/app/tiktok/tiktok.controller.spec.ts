import { Test, TestingModule } from "@nestjs/testing";
import { getModelToken } from "@nestjs/mongoose";
import { JwtModule } from "@nestjs/jwt";
import { User, History } from "@scr-web/server-schemas";
import { initEnvironment } from "@scr-web/server-interfaces";
import { TikTokController } from "./tiktok.controller";
import { TikTokService } from "./tiktok.service";
import { StorageService } from "../storage/storage.service";
import { HistoryService } from "../history/history.service";

describe("Tiktok Controller", () => {
	let controller: TikTokController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [
				JwtModule.register({secret: initEnvironment().JWT_SECRET}),
			],
			controllers: [TikTokController],
			providers: [
				TikTokService,
				HistoryService,
				StorageService,
				{
					provide: getModelToken("Users"),
					useValue: (dto: User) => {
						// @ts-ignore
						dto = this.data;
						// @ts-ignore
						this.save  = async () => this.data;
					}
				},{
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

	it("should be defined", () => expect(controller).toBeDefined());
});
