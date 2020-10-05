import { Test, TestingModule } from "@nestjs/testing";
import { getModelToken } from "@nestjs/mongoose";
import { HistoryService } from "./history.service";

describe("HistoryService", () => {
	let service: HistoryService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				HistoryService,
				{
					provide: getModelToken("History"),
					useValue: (dto: History) => {
						// @ts-ignore
						dto = this.data;
						// @ts-ignore
						this.save  = async () => this.data;
					}
				}
			],
		}).compile();

		service = module.get<HistoryService>(HistoryService);
	});

	it("should be defined", () => expect(service).toBeDefined());
});
