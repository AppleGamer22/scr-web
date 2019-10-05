import { Test, TestingModule } from "@nestjs/testing";
import { InstagramController } from "./instagram.controller";
import { InstagramService } from "./instagram.service";

describe("InstagramController", () => {
	let controller: InstagramController;
	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [InstagramController],
			providers: [InstagramService],
		}).compile();
		controller = module.get<InstagramController>(InstagramController);
	});

	it("should be defined", () => {
		expect(controller).toBeDefined();
	});
});
