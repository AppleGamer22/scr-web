import { NestFactory } from "@nestjs/core";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { name, description, version, license, repository } from "package.json";
import { AppModule } from "./app/app.module";

async function bootstrap() {
	const port = process.env.PORT || 4100;
	const app = await NestFactory.create(AppModule, { cors: true });
	app.setGlobalPrefix("api");
	const config = new DocumentBuilder().setTitle(name).setDescription(description).setVersion(version).setLicense(license, repository.url).build();
	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup("api/swagger", app, document);
	await app.listen(port, () => console.log(`Listening at http://localhost:${port}/api`));
}

bootstrap();
