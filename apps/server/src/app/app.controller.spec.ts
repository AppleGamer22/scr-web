import { Test, TestingModule } from "@nestjs/testing";
import { AppController } from "./app.controller";

describe("AppController", () => {
	let controller: AppController;
	beforeAll(async () => {
		const module = await Test.createTestingModule({
			controllers: [AppController]
		}).compile();
		controller = module.get<AppController>(AppController);
	});

	it("should be defined", () => {
		expect(controller).toBeDefined();
	});
});
