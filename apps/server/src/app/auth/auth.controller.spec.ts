import { Test, TestingModule } from "@nestjs/testing";
import { getModelToken } from "@nestjs/mongoose";
import { JwtModule } from "@nestjs/jwt";
import { User } from "@scr-gui/server-schemas";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { InstagramService } from "../instagram/instagram.service";

describe("AuthController", () => {
	let controller: AuthController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [
				JwtModule.register({secret: "x7txX%eP8de3&Q4Y&J9bF$^4w2iEm"}),
			],
			controllers: [AuthController],
			providers: [
				AuthService,
				InstagramService,
				{
					provide: getModelToken("Users"),
					useValue: (dto: User) => {
						this.data = dto;
						this.save  = async () => this.data;
					}
				}
			]
		}).compile();

		controller = module.get<AuthController>(AuthController);
	});

	it("should be defined", () => {
		expect(controller).toBeDefined();
	});
});
