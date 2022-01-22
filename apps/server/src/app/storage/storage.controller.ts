import { Controller, Get, Delete, Param, HttpException, HttpStatus, Res } from "@nestjs/common";
import { History } from "@scr-web/server-schemas";
import { FileType } from "@scr-web/client-schemas";
import { Response } from "express";
import { join } from "path";
import { HistoryService } from "../history/history.service";
import { StorageService } from "../storage/storage.service";

@Controller("storage") export class StorageController {
	constructor(
		private readonly storageService: StorageService,
		private readonly historyService: HistoryService
	) {}

	@Get(":type/:directory/:file") getFile(
		@Param("type") type: FileType,
		@Param("directory") directory: string,
		@Param("file") file: string,
		@Res() response: Response
	) {
		const fullPath = join(process.env.STORAGE_PATH, type, directory, file);
		if (fullPath.includes("..")) {
			throw new HttpException(`File at path ${fullPath} is out of scope.`, HttpStatus.FORBIDDEN);
		}
		try {
			return response.status(HttpStatus.OK).sendFile(fullPath);
		} catch (error) {
			throw new HttpException(`Could not get file ${type}/${directory}/${file}`, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@Delete(":type/:directory/:file") async deleteFile(
		@Param("type") type: FileType,
		@Param("directory") directory: string,
		@Param("file") file: string,
	): Promise<History> {
		const fullPath = join(process.env.STORAGE_PATH, type, directory, file);
		if (fullPath.includes("..")) {
			throw new HttpException(`File at path ${fullPath} is out of scope.`, HttpStatus.FORBIDDEN);
		}
		try {
			this.storageService.removeFile(type, directory, file);
			const history = await this.historyService.deleteHistoryURL(`${type}/${directory}/${file}`);
			if (history.urls.length === 0) {
				return await this.historyService.deleteHistoryItem(history._id);
			} else {
				return history;
			}
		} catch (error) {
			throw new HttpException(`Could not delete file ${type}/${directory}/${file}`, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
}
