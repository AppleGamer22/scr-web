import { Injectable } from "@nestjs/common";
import { HttpService } from "@nestjs/common";
import { FileType } from "@scr-web/client-schemas";
import { AxiosRequestConfig } from "axios";
import { existsSync, mkdirSync, writeFileSync, rmSync } from "fs";

@Injectable() export class StorageService {
	constructor(private readonly http: HttpService) {}
	/**
	 * saves file to file system from Buffer
	 * @param type file source
	 * @param directory directory name
	 * @param file file name
	 * @param data file contents (Buffer)
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
	/**
	 * saves file to file system from URL
	 * @param type file source
	 * @param directory directory name
	 * @param file file name
	 * @param url file contents' URL
	 */
	async addFileFromURL(type: FileType, directory: string, file: string, url: string, tiktok = false, cookies?: string, userAgent?: string) {
		const directoryPath = `${process.cwd()}/storage/${type}/${directory}`;
		const fullPath = `${directoryPath}/${file}`;
		try {
			let config: AxiosRequestConfig = {responseType: "arraybuffer"}
			if (tiktok && cookies !== undefined) {
				config.headers = {
					Cookie: cookies,
					Host: new URL(url).host,
					Range: "bytes=0-",
					Referer: "https://www.tiktok.com/"
				};
			}
			// if (userAgent !== undefined) {
			// 	config.headers = {
			// 		...config.headers,
			// 		"User-Agent": userAgent
			// 	}
			// }
			const { data } = await this.http.get(url, config).toPromise();
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
