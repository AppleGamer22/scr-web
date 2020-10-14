import { Test, TestingModule } from "@nestjs/testing";
import { getModelToken } from "@nestjs/mongoose";
import { VSCOController } from "./vsco.controller";
import { VSCOService } from "./vsco.service";
import { HistoryService } from "../history/history.service";

describe("VSCOController", () => {
	let controller: VSCOController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [VSCOController],
			providers: [
				VSCOService,
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
			]
		}).compile();

		controller = module.get<VSCOController>(VSCOController);
	});

	it("should be defined", () => expect(controller).toBeDefined());
});
