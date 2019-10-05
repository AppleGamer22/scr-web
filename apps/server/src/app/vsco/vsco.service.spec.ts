import { Test, TestingModule } from "@nestjs/testing";
import { VSCOService } from "./vsco.service";

describe("VSCOService", () => {
	let service: VSCOService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [VSCOService],
		}).compile();

		service = module.get<VSCOService>(VSCOService);
	});

	it("should be defined", () => {
		expect(service).toBeDefined();
	});
});
