import { Test, TestingModule } from "@nestjs/testing";
import { HttpModule } from "@nestjs/common";
import { getModelToken } from "@nestjs/mongoose";
import { StorageController } from "./storage.controller";
import { StorageService } from "./storage.service";
import { HistoryService } from "../history/history.service";

describe("StorageController", () => {
	let controller: StorageController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [
				HttpModule
			],
			controllers: [StorageController],
			providers: [
				StorageService,
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

		controller = module.get<StorageController>(StorageController);
	});

	it("should be defined", () => expect(controller).toBeDefined());
});
