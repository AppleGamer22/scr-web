import { Test, TestingModule } from "@nestjs/testing";
import { JwtModule } from "@nestjs/jwt";
import { getModelToken } from "@nestjs/mongoose";
import { User } from "@scr-gui/server-schemas";
import { InstagramController } from "./instagram.controller";
import { InstagramService } from "./instagram.service";

describe("InstagramController", () => {
	let controller: InstagramController;
	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [
				JwtModule.register({secret: "x7txX%eP8de3&Q4Y&J9bF$^4w2iEm"}),
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
