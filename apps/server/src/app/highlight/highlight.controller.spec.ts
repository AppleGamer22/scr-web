import { Test, TestingModule } from "@nestjs/testing";
import { JwtModule } from "@nestjs/jwt";
import { getModelToken } from "@nestjs/mongoose";
import { HttpModule } from "@nestjs/common";
import { User, History } from "@scr-web/server-schemas";
import { initEnvironment } from "@scr-web/server-interfaces";
import { HighlightController } from "./highlight.controller";
import { HighlightService } from "./highlight.service";
import { HistoryService } from "../history/history.service";
import { StorageService } from "../storage/storage.service";

describe("HighlightController", () => {
	let controller: HighlightController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [
				JwtModule.register({secret: initEnvironment().JWT_SECRET}),
				HttpModule
			],
			controllers: [HighlightController],
			providers: [
				HighlightService,
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

		controller = module.get<HighlightController>(HighlightController);
	});

	it("should be defined", () => {
		expect(controller).toBeDefined();
	});
});
