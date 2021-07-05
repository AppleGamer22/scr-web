import { Module, HttpModule } from "@nestjs/common";
import { APP_FILTER, APP_INTERCEPTOR } from "@nestjs/core";
import { ServeStaticModule } from "@nestjs/serve-static";
import { MongooseModule, } from "@nestjs/mongoose";
import { JwtModule } from "@nestjs/jwt";
import { UserSchema, HistorySchema } from "@scr-web/server-schemas";
import { initEnvironment } from "@scr-web/server-interfaces";
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
import { AuthGuard } from "./auth/auth.guard";
import { HistoryController } from "./history/history.controller";
import { HistoryService } from "./history/history.service";
import { TikTokController } from "./tiktok/tiktok.controller";
import { TikTokService } from "./tiktok/tiktok.service";
import { StorageController } from "./storage/storage.controller";
import { StorageService } from "./storage/storage.service";
import { VersionController } from "./version/version.controller";

@Module({
	imports: [
		MongooseModule.forRoot(initEnvironment().DATABASE_URL, {
			useNewUrlParser: true,
			useFindAndModify: false,
			useCreateIndex: true,
			useUnifiedTopology: true,
			retryAttempts: Number.MAX_VALUE,
		}),
		MongooseModule.forFeature([
			{
				name: "Users",
				schema: UserSchema
			},{
				name: "History",
				schema: HistorySchema
			}
		]),
		JwtModule.register({secret: initEnvironment().JWT_SECRET}),
		ServeStaticModule.forRoot({rootPath: `${__dirname}/../client/`}),
		HttpModule
	],
	controllers: [
		AppController,
		InstagramController,
		VSCOController,
		StoryController,
		HighlightController,
		AuthController,
		HistoryController,
		TikTokController,
		StorageController,
		VersionController
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
		AuthGuard,
		HistoryService,
		TikTokService,
		StorageService
	],
}) export class AppModule {}
