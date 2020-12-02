import { Controller, Get, Param, HttpException, HttpStatus, Res } from "@nestjs/common";
import { Response } from "express";
import { StorageService } from "../storage/storage.service";

@Controller("storage") export class StorageController {
	constructor(private readonly storageService: StorageService) {}

	@Get(":type/:directory/:file") getFile(
		@Param("type") type: string,
		@Param("directory") directory: string,
		@Param("file") file: string,
		@Res() response: Response
	) {
		const fullPath = `${process.cwd()}/storage/${type}/${directory}/${file}`;
		try {
			return response.status(HttpStatus.OK).sendFile(fullPath);
		} catch (error) {
			throw new HttpException(`could not remove file ${type}/${directory}/${file}`, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
}
