import { Injectable } from "@nestjs/common";
import { existsSync, mkdirSync, writeFileSync, rmdirSync } from "fs";

export type FileType = "instagram" | "highlight" | "story" | "vsco" | "tiktok";

@Injectable() export class StorageService {
	/**
	 * saves file to file system
	 * @param type file source
	 * @param directory directory name
	 * @param file file name
	 * @param data file contents
	 */
	addFile(type: FileType, directory: string, file: string, data: Buffer) {
		const directoryPath = `${process.cwd()}/storage/${type}/${directory}`;
		const fullPath = `${directoryPath}/${file}`;
		try {
			if (!existsSync(directoryPath)) mkdirSync(directoryPath, {recursive: true});
			if (!existsSync(fullPath)) writeFileSync(fullPath, data, {encoding: "binary", flag: "w"});
		} catch (error) {
			console.log(error)
			throw new Error(`could not save file ${type}/${directory}/${file}`);
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
			if (existsSync(fullPath)) rmdirSync(fullPath);
		} catch (error) {
			throw new Error(`could not remove file ${type}/${directory}/${file}`);
		}
	}
}
