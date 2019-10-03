import { Module } from "@nestjs/common";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { InstagramService } from './instagram/instagram.service';
import { VscoService } from './vsco/vsco.service';

@Module({
	imports: [],
	controllers: [AppController],
	providers: [AppService, InstagramService, VscoService],
}) export class AppModule {}
