import { Test, TestingModule } from "@nestjs/testing";
import { VscoService } from "./vsco.service";

describe("VscoService", () => {
	let service: VscoService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [VscoService],
		}).compile();

		service = module.get<VscoService>(VscoService);
	});

	it("should be defined", () => {
		expect(service).toBeDefined();
	});
});
