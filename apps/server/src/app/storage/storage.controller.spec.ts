import { Test, TestingModule } from "@nestjs/testing";
import { HttpModule } from "@nestjs/common";
import { StorageController } from "./storage.controller";
import { StorageService } from "./storage.service";

describe("StorageController", () => {
	let controller: StorageController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [
				HttpModule
			],
			controllers: [StorageController],
			providers: [
				StorageService
			]
		}).compile();

		controller = module.get<StorageController>(StorageController);
	});

	it("should be defined", () => expect(controller).toBeDefined());
});
