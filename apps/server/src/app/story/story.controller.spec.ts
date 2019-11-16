import { Test, TestingModule } from "@nestjs/testing";
import { getModelToken } from "@nestjs/mongoose";
import { JwtModule } from "@nestjs/jwt";
import { User } from "@scr-gui/server-schemas";
import { initEnvironment } from "@scr-gui/server-interfaces";
import { StoryController } from "./story.controller";
import { StoryService } from "./story.service";

describe("StoryController", () => {
	let controller: StoryController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [
				JwtModule.register({secret: initEnvironment().JWT_SECRET}),
			],
			controllers: [StoryController],
			providers: [
				StoryService,
				{
					provide: getModelToken("Users"),
					useValue: (dto: User) => {
						this.data = dto;
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
