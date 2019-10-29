import { Test, TestingModule } from "@nestjs/testing";
import { getModelToken } from "@nestjs/mongoose";
import { User } from "@scr-gui/server-schemas";
import { StoryController } from "./story.controller";
import { StoryService } from "./story.service";
import { JwtModule } from "@nestjs/jwt";

describe("StoryController", () => {
	let controller: StoryController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [
				JwtModule.register({secret: "x7txX%eP8de3&Q4Y&J9bF$^4w2iEm"}),
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
