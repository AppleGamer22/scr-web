import { Module } from "@nestjs/common";
import { APP_FILTER, APP_INTERCEPTOR } from "@nestjs/core";
import { ErrorFilter } from "./error.filter";
import { LogsInterceptor } from "./logs.interceptor";
import { AppController } from "./app.controller";
import { InstagramService } from "./instagram/instagram.service";
import { InstagramController } from "./instagram/instagram.controller";
import { VSCOService } from "./vsco/vsco.service";
import { VSCOController } from "./vsco/vsco.controller";
import { StoryService } from "./story/story.service";
import { StoryController } from "./story/story.controller";

@Module({
	imports: [],
	controllers: [
		AppController,
		InstagramController,
		VSCOController,
		StoryController
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
	],
}) export class AppModule {}
