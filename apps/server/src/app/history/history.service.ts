import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { History } from "@scr-web/server-schemas";
import { Model, Types } from "mongoose";

@Injectable() export class HistoryService {
	constructor(@InjectModel("History") private readonly historyCollection: Model<History>) {}

	async getHistory(U_ID: string): Promise<History[]> {
		try {
			return await this.historyCollection.find({ U_ID }).exec();
		} catch (error) {
			throw new Error(error.message as string);
		}
	}

	async addHistoryItem(url: string, U_ID: string, item: { urls: string[], network: "instagram" | "vsco" }): Promise<History> {
		try {
			// https://mongoosejs.com/docs/tutorials/findoneandupdate.html
			return this.historyCollection.findOneAndUpdate({_id: url}, {
				U_ID,
				urls: item.urls,
				network: item.network
			}, {new: true, upsert: true}).exec();
		} catch (error) {
			throw new Error(error.message as string);
		}
	}

	async deleteHistoryItem(_id: string): Promise<History> {
		try {
			return this.historyCollection.findByIdAndRemove(_id).exec();
		} catch (error) {
			throw new Error(error.message as string);
		}
	}
}