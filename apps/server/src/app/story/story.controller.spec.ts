import { Test, TestingModule } from "@nestjs/testing";
import { getModelToken } from "@nestjs/mongoose";
import { JwtModule } from "@nestjs/jwt";
import { HttpModule } from "@nestjs/common";
import { User, History } from "@scr-web/server-schemas";
import { initEnvironment } from "@scr-web/server-interfaces";
import { StoryController } from "./story.controller";
import { StoryService } from "./story.service";
import { HistoryService } from "../history/history.service";
import { StorageService } from "../storage/storage.service";

describe("StoryController", () => {
	let controller: StoryController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [
				JwtModule.register({secret: initEnvironment().JWT_SECRET}),
				HttpModule
			],
			controllers: [StoryController],
			providers: [
				StoryService,
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

		controller = module.get<StoryController>(StoryController);
	});

	it("should be defined", () => {
		expect(controller).toBeDefined();
	});
});
