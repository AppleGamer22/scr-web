import { Test, TestingModule } from "@nestjs/testing";
import { getModelToken } from "@nestjs/mongoose";
import { JwtModule } from "@nestjs/jwt";
import { User } from "@scr-web/server-schemas";
import { AuthGuard } from "./auth.guard";

describe("AuthGuard", () => {
	let guard: AuthGuard;
	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [
				JwtModule.register({secret: process.env.JWT_SECRET}),
			],
			providers: [
				AuthGuard,
				{
					provide: getModelToken("Users"),
					useValue: (dto: User) => {
						// @ts-ignore
						dto = this.data;
						// @ts-ignore
						this.save  = async () => this.data;
					}
				}
			]
		}).compile();

		guard = module.get<AuthGuard>(AuthGuard);
	});

	it("should be defined", () => {
		expect(guard).toBeDefined();
	});
});
