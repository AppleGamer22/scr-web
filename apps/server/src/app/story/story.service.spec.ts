import { Test, TestingModule } from "@nestjs/testing";
import { StoryService } from "./story.service";

describe("StoryService", () => {
	let service: StoryService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [StoryService],
		}).compile();

		service = module.get<StoryService>(StoryService);
	});

	it("should be defined", () => {
		expect(service).toBeDefined();
	});
});
