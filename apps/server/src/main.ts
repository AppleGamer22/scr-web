import { NestFactory } from "@nestjs/core";
// import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
// import { name, description, version, license, repository } from "package.json";
import { AppModule } from "./app/app.module";

async function bootstrap() {
	const port = process.env.PORT || 4100;
	const app = await NestFactory.create(AppModule, { cors: true });
	app.setGlobalPrefix("api");

	const { JWT_SECRET, DATABASE_URL, STORAGE_PATH, USERS_PATH } = process.env;
	// if (JWT_SECRET === undefined || DATABASE_URL === undefined) {
	// 	console.error("Some environment are not defined.");
	// 	process.exit(1);
	// }

	if (STORAGE_PATH !== undefined) {
		console.log(`Serving media from: ${STORAGE_PATH}`);
	}
	if (USERS_PATH !== undefined) {
		console.log(`Using user data from: ${USERS_PATH}`);
	}

	// const config = new DocumentBuilder().setTitle(name).setDescription(description).setVersion(version).setLicense(license, repository.url).build();
	// const document = SwaggerModule.createDocument(app, config);
	// SwaggerModule.setup("api/swagger", app, document);
	try {
		await app.listen(port, () => console.log(`Listening at http://localhost:${port}/api`));
	} catch (err) {
		console.error(err);
		process.exit(1);
	}
}

bootstrap();
