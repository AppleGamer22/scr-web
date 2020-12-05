import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { History, HistoryDocument } from "@scr-web/server-schemas";
import { Model } from "mongoose";

@Injectable() export class HistoryService {
	constructor(@InjectModel("History") private readonly historyCollection: Model<HistoryDocument>) {}
	/**
	 * Finds user's History items in database
	 * @param U_ID user's _id property
	 * @returns History items array
	 */
	async getHistory(U_ID: string): Promise<History[]> {
		try {
			return await this.historyCollection.find({ U_ID }).exec();
		} catch (error) {
			throw new Error(error.message as string);
		}
	}
	/**
	 *
	 * @param _id History item ID
	 * @param U_ID user's _id property
	 * @param item History item core properties
	 * @returns added History item
	 */
	async addHistoryItem(
		_id: string,
		U_ID: string,
		item: {
			urls: string[],
			type: "instagram" | "highlight" | "story" | "vsco" | "tiktok",
			owner: string
			post: string
		}
	): Promise<History> {
		try {
			// https://mongoosejs.com/docs/tutorials/findoneandupdate.html
			return this.historyCollection.findOneAndUpdate({ _id }, {
				U_ID,
				urls: item.urls,
				type: item.type,
				owner: item.owner,
				post: item.post
			}, {new: true, upsert: true}).exec();
		} catch (error) {
			throw new Error(error.message as string);
		}
	}
	async getHistoryItemBy_ID(_id: string, U_ID: string): Promise<History> {
		try {
			return this.historyCollection.findOne({_id, U_ID});
		} catch (error) {
			throw new Error(error.message as string);
		}
	}
	async getHistoryItemByPost(post: string, U_ID: string): Promise<History> {
		try {
			return this.historyCollection.findOne({post, U_ID});
		} catch (error) {
			throw new Error(error.message as string);
		}
	}
	/**
	 * Deletes a History item from database
	 * @param _id  History item ID to delete
	 * @returns Deleted History item
	 */
	async deleteHistoryItem(_id: string): Promise<History> {
		try {
			return this.historyCollection.findByIdAndRemove(_id).exec();
		} catch (error) {
			throw new Error(error.message as string);
		}
	}
}