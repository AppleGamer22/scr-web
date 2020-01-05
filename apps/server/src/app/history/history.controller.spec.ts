import { initEnvironment } from "@scr-gui/server-interfaces";
import { Test, TestingModule } from "@nestjs/testing";
import { getModelToken } from "@nestjs/mongoose";
import { JwtModule } from "@nestjs/jwt";
import { HistoryController } from "./history.controller";
import { HistoryService } from "./history.service";
import { User, History } from "@scr-gui/server-schemas";

describe("History Controller", () => {
	let controller: HistoryController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [
				JwtModule.register({secret: initEnvironment().JWT_SECRET}),
			],
			controllers: [HistoryController],
			providers: [
				HistoryService,
				{
					provide: getModelToken("Users"),
					useValue: (dto: User) => {
						this.data = dto;
						this.save  = async () => this.data;
					}
				},{
					provide: getModelToken("History"),
					useValue: (dto: History) => {
						this.data = dto;
						this.save  = async () => this.data;
					}
				}
			]
		}).compile();

		controller = module.get<HistoryController>(HistoryController);
	});

	it("should be defined", () => expect(controller).toBeDefined());
});