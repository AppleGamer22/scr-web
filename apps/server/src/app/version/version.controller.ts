import { Controller, Get, HttpException, HttpStatus, Res } from "@nestjs/common";
import { readFileSync } from "fs";
import { join } from "path";
import { Response } from "express";

@Controller("version") export class VersionController {
	@Get() getVersion(@Res() response: Response): Response {
		try {
			const packagePath = join(process.cwd(), "package.json");
			const { version } = JSON.parse(readFileSync(packagePath).toString()) as {version: string};
			return response.json({ version }).status(HttpStatus.OK);
		} catch (error) {
			throw new HttpException("Version number could not be found", HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
}
