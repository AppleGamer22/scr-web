import { Test, TestingModule } from "@nestjs/testing";
import { HttpModule } from "@nestjs/common";
import { StorageService } from "./storage.service";

describe("StorageService", () => {
	let service: StorageService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [HttpModule],
			providers: [StorageService],
		}).compile();

		service = module.get<StorageService>(StorageService);
	});

	it("should be defined", () => {
		expect(service).toBeDefined();
	});
});
