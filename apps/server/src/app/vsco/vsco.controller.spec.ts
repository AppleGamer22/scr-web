import { Test, TestingModule } from "@nestjs/testing";
import { getModelToken } from "@nestjs/mongoose";
import { JwtModule } from "@nestjs/jwt";
import { HttpModule } from "@nestjs/common";
import { User, History } from "@scr-web/server-schemas";
import { VSCOController } from "./vsco.controller";
import { VSCOService } from "./vsco.service";
import { HistoryService } from "../history/history.service";
import { StorageService } from "../storage/storage.service";

describe("VSCOController", () => {
	let controller: VSCOController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [
				JwtModule.register({secret: process.env.JWT_SECRET}),
				HttpModule
			],
			controllers: [VSCOController],
			providers: [
				VSCOService,
				HistoryService,
				StorageService,
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

		controller = module.get<VSCOController>(VSCOController);
	});

	it("should be defined", () => expect(controller).toBeDefined());
});
