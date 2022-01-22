import { Injectable } from "@nestjs/common";
import { HttpService } from "@nestjs/common";
import { FileType } from "@scr-web/client-schemas";
import { AxiosRequestConfig } from "axios";
import { existsSync, mkdirSync, readdirSync, rmSync, rmdirSync, createWriteStream } from "fs";
import { join, dirname } from "path";
import { Stream } from "stream";

@Injectable() export class StorageService {
	constructor(private readonly http: HttpService) {}
	/**
	 * saves file to file system from Buffer
	 * @param type file source
	 * @param directory directory name
	 * @param file file name
	 * @param data file contents (Buffer)
	 */
	// addFileFromBuffer(type: FileType, directory: string, file: string, data: Buffer) {
	// 	const directoryPath = join(process.env.STORAGE_PATH, type, directory);
	// 	const fullPath = join(directoryPath, file);
	// 	try {
	// 		if (!existsSync(directoryPath)) mkdirSync(directoryPath, {recursive: true});
	// 		if (!existsSync(fullPath)) writeFileSync(fullPath, data, {encoding: "binary"});
	// 	} catch (error) {
	// 		console.error(error);
	// 		throw new Error(`Could not save file ${type}/${directory}/${file}`);
	// 	}
	// }

	private downloadFileFromURLBuffer(path: string, url: string, tiktok = false, cookies?: string, userAgent?: string): Promise<void> {
		return new Promise(async (resolve, reject) => {
			let config: AxiosRequestConfig = {responseType: "stream"}
			if (tiktok && cookies !== undefined) {
				config.headers = {
					Cookie: cookies,
					Host: new URL(url).host,
					Range: "bytes=0-",
					Referer: "https://www.tiktok.com/"
				};
			}
			const writer = createWriteStream(path);
			this.http.get<Stream>(url, config).toPromise().then(response => {
				response.data.pipe(writer);
			}).catch(err => {
				writer.close();
				rmSync(path);
				reject(err);
			});
			writer.on("error", err => {
				writer.close();
				rmSync(path);
				reject(err);
			});
			writer.on("finish", () => {
				writer.close();
				resolve();
			});
		});
	}

	/**
	 * saves file to file system from URL
	 * @param type file source
	 * @param directory directory name
	 * @param file file name
	 * @param url file contents' URL
	 */
	async addFileFromURL(type: FileType, directory: string, file: string, url: string, tiktok = false, cookies?: string, userAgent?: string) {
		const directoryPath = join(process.env.STORAGE_PATH, type, directory);
		const fullPath = join(directoryPath, file);
		try {
			if (!existsSync(directoryPath)) mkdirSync(directoryPath, {recursive: true});
			await this.downloadFileFromURLBuffer(fullPath, url, tiktok, cookies);
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
		const directoryPath = join(process.env.STORAGE_PATH, type, directory);
		const fullPath = join(directoryPath, file);
		try {
			if (existsSync(fullPath)) {
				rmSync(fullPath);
				if (readdirSync(directoryPath).length === 0) {
					rmdirSync(directoryPath);
				}
			}
		} catch (error) {
			console.error(error);
			throw new Error(`Could not remove file ${type}/${directory}/${file}`);
		}
	}
}
