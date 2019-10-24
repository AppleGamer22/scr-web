import { Test, TestingModule } from "@nestjs/testing";
import { JwtModule } from "@nestjs/jwt";
import { getModelToken } from "@nestjs/mongoose";
import { User } from "@scr-gui/server-schemas";
import { HighlightController } from "./highlight.controller";
import { HighlightService } from "./highlight.service";

describe("HighlightController", () => {
	let controller: HighlightController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [
				JwtModule.register({secret: "x7txX%eP8de3&Q4Y&J9bF$^4w2iEm"}),
			],
			controllers: [HighlightController],
			providers: [
				HighlightService,
				{
					provide: getModelToken("Users"),
					useValue: (dto: User) => {
						this.data = dto;
						this.save  = async () => this.data;
					}
				}
			]
		}).compile();

		controller = module.get<HighlightController>(HighlightController);
	});

	it("should be defined", () => {
		expect(controller).toBeDefined();
	});
});
