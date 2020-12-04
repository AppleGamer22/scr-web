import { Test, TestingModule } from "@nestjs/testing";
import { JwtModule } from "@nestjs/jwt";
import { getModelToken } from "@nestjs/mongoose";
import { HttpModule } from "@nestjs/common";
import { User } from "@scr-web/server-schemas";
import { initEnvironment } from "@scr-web/server-interfaces";
import { InstagramController } from "./instagram.controller";
import { InstagramService } from "./instagram.service";
import { HistoryService } from "../history/history.service";
import { StorageService } from "../storage/storage.service";

describe("InstagramController", () => {
	let controller: InstagramController;
	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [
				JwtModule.register({secret: initEnvironment().JWT_SECRET}),
				HttpModule
			],
			controllers: [InstagramController],
			providers: [
				InstagramService,
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
			],
		}).compile();
		controller = module.get<InstagramController>(InstagramController);
	});

	it("should be defined", () => expect(controller).toBeDefined());
});
