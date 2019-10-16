import { Test, TestingModule } from "@nestjs/testing";
import { VSCOController } from "./vsco.controller";
import { VSCOService } from "./vsco.service";

describe("VSCOController", () => {
	let controller: VSCOController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [VSCOController],
			providers: [VSCOService]
		}).compile();

		controller = module.get<VSCOController>(VSCOController);
	});

	it("should be defined", () => {
		expect(controller).toBeDefined();
	});
});
