import { Test, TestingModule } from "@nestjs/testing";
import { JwtModule } from "@nestjs/jwt";
import { getModelToken } from "@nestjs/mongoose";
import { User } from "@scr-gui/server-schemas";
import { initEnvironment } from "@scr-gui/server-interfaces";
import { InstagramController } from "./instagram.controller";
import { InstagramService } from "./instagram.service";

describe("InstagramController", () => {
	let controller: InstagramController;
	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [
				JwtModule.register({secret: initEnvironment().JWT_SECRET}),
			],
			controllers: [InstagramController],
			providers: [
				InstagramService,
				{
					provide: getModelToken("Users"),
					useValue: (dto: User) => {
						this.data = dto;
						this.save  = async () => this.data;
					}
				}
			],
		}).compile();
		controller = module.get<InstagramController>(InstagramController);
	});

	it("should be defined", () => {
		expect(controller).toBeDefined();
	});
});
