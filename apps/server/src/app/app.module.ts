import { Module } from "@nestjs/common";
import { APP_FILTER, APP_INTERCEPTOR } from "@nestjs/core";
import { MongooseModule, } from "@nestjs/mongoose";
import { JwtModule } from "@nestjs/jwt";
import { UserSchema, PostSchema } from "@scr-gui/server-schemas";
import { ErrorFilter } from "./error.filter";
import { LogsInterceptor } from "./logs.interceptor";
import { AppController } from "./app.controller";
import { InstagramService } from "./instagram/instagram.service";
import { InstagramController } from "./instagram/instagram.controller";
import { VSCOService } from "./vsco/vsco.service";
import { VSCOController } from "./vsco/vsco.controller";
import { StoryService } from "./story/story.service";
import { StoryController } from "./story/story.controller";
import { HighlightService } from "./highlight/highlight.service";
import { HighlightController } from "./highlight/highlight.controller";
import { AuthController } from "./auth/auth.controller";
import { AuthService } from "./auth/auth.service";

@Module({
	imports: [
		MongooseModule.forRoot("mongodb://localhost:27017/scr", {useNewUrlParser: true, retryAttempts: Number.MAX_VALUE}),
		MongooseModule.forFeature([
			{
				name: "Users",
				schema: UserSchema
			},{
				name: "Posts",
				schema: PostSchema
			}
		]),
		JwtModule.register({secret: "x7txX%eP8de3&Q4Y&J9bF$^4w2iEm"})
	],
	controllers: [
		AppController,
		InstagramController,
		VSCOController,
		StoryController,
		HighlightController,
		AuthController
	],
	providers: [
		{
			provide: APP_FILTER,
			useClass: ErrorFilter,
		},{
			provide: APP_INTERCEPTOR,
			useClass: LogsInterceptor,
		},
		InstagramService,
		VSCOService,
		StoryService,
		HighlightService,
		AuthService,
	],
}) export class AppModule {}
