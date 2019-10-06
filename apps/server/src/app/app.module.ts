import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { InstagramService } from "./instagram/instagram.service";
import { VSCOService } from "./vsco/vsco.service";
import { InstagramController } from "./instagram/instagram.controller";
import { APP_FILTER, APP_INTERCEPTOR } from "@nestjs/core";
import { ErrorFilter } from "./error.filter";
import { LogsInterceptor } from "./logs.interceptor";
import { VSCOController } from "./vsco/vsco.controller";

@Module({
	imports: [],
	controllers: [AppController, InstagramController, VSCOController],
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
	],
}) export class AppModule {}
