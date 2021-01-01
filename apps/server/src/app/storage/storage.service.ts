import { Injectable } from "@nestjs/common";
import { HttpService } from "@nestjs/common";
import { FileType } from "@scr-web/server-schemas";
import { existsSync, mkdirSync, writeFileSync, rmSync } from "fs";

@Injectable() export class StorageService {
	constructor(private readonly http: HttpService) {}
	/**
	 * saves file to file system
	 * @param type file source
	 * @param directory directory name
	 * @param file file name
	 * @param data file contents
	 */
	addFileFromBuffer(type: FileType, directory: string, file: string, data: Buffer) {
		const directoryPath = `${process.cwd()}/storage/${type}/${directory}`;
		const fullPath = `${directoryPath}/${file}`;
		try {
			if (!existsSync(directoryPath)) mkdirSync(directoryPath, {recursive: true});
			if (!existsSync(fullPath)) writeFileSync(fullPath, data, {encoding: "binary"});
		} catch (error) {
			console.error(error);
			throw new Error(`Could not save file ${type}/${directory}/${file}`);
		}
	}
	async addFileFromURL(type: FileType, directory: string, file: string, url: string) {
		const directoryPath = `${process.cwd()}/storage/${type}/${directory}`;
		const fullPath = `${directoryPath}/${file}`;
		try {
			const { data } = await this.http.get(url, {responseType: "arraybuffer"}).toPromise();
			if (!existsSync(directoryPath)) mkdirSync(directoryPath, {recursive: true});
			if (!existsSync(fullPath)) writeFileSync(fullPath, data, {encoding: "binary"});
		} catch (error) {
			console.error(error);
			throw new Error(`Could not save file ${type}/${directory}/${file}`);
		}
	}
	/**
	 * removes file from file system
	 * @param type file source
	 * @param directory directory name
	 * @param file file name
	 */
	removeFile(type: FileType, directory: string, file: string) {
		const fullPath = `${process.cwd()}/storage/${type}/${directory}/${file}`;
		try {
			if (existsSync(fullPath)) rmSync(fullPath);
		} catch (error) {
			console.error(error);
			throw new Error(`Could not remove file ${type}/${directory}/${file}`);
		}
	}
}
