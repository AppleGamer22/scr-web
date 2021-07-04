import { Controller, Get, HttpException, HttpStatus, Res } from "@nestjs/common";
import { readFileSync } from "fs";
import { Response } from "express";

@Controller("version") export class VersionController {
	@Get() getVersion(@Res() response: Response): Response {
		try {
			const { version } = JSON.parse(readFileSync(`${process.cwd()}/package.json`).toString()) as {version: string};
			return response.json({ version }).status(HttpStatus.OK);
		} catch (error) {
			throw new HttpException("Version number could not be found", HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
}
