import { Test, TestingModule } from "@nestjs/testing";
import { AppController } from "./app.controller";
import { getModelToken } from "@nestjs/mongoose";
import { User, Post } from "@scr-gui/server-schemas";

describe("AppController", () => {
	let controller: AppController;
	beforeAll(async () => {
		const module = await Test.createTestingModule({
			controllers: [AppController],
			providers: [
				//https://stackoverflow.com/questions/55143467/testing-mongoose-models-with-nestjs
				{
					provide: getModelToken("Users"),
					useValue: (dto: User) => {
						this.data = dto;
						this.save  = async () => this.data;
					}
				},{
					provide: getModelToken("Posts"),
					useValue: (dto: Post) => {
						this.data = dto;
						this.save  = async () => this.data;
					}
				}
			]
		}).compile();
		controller = module.get<AppController>(AppController);
	});

	it("should be defined", () => {
		expect(controller).toBeDefined();
	});
});
