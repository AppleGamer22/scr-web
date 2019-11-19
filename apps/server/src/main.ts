import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app/app.module";

async function bootstrap() {
	const port = process.env.PORT || 4100;
	const globalPrefix = "api";
	const app = await NestFactory.create(AppModule, {cors: true});
	app.setGlobalPrefix(globalPrefix);
	await app.listen(port, () => console.log(`Listening at http://localhost:${port}/${globalPrefix}`));
}

bootstrap();
