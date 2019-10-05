import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { InstagramService } from "./instagram/instagram.service";
import { VscoService } from "./vsco/vsco.service";
import { InstagramController } from "./instagram/instagram.controller";

@Module({
	imports: [],
	controllers: [AppController, InstagramController],
	providers: [InstagramService, VscoService],
})
export class AppModule {}
