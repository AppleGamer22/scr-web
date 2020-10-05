import { initEnvironment } from "@scr-web/server-interfaces";
import { Test, TestingModule } from "@nestjs/testing";
import { getModelToken } from "@nestjs/mongoose";
import { JwtModule } from "@nestjs/jwt";
import { HistoryController } from "./history.controller";
import { HistoryService } from "./history.service";
import { User, History } from "@scr-web/server-schemas";

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
						// @ts-ignore
						dto = this.data;
						// @ts-ignore
						this.save  = async () => this.data;
					}
				},{
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

		controller = module.get<HistoryController>(HistoryController);
	});

	it("should be defined", () => expect(controller).toBeDefined());
});
