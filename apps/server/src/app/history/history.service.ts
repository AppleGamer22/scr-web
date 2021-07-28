import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { History, HistoryDocument } from "@scr-web/server-schemas";
import { FileType } from "@scr-web/client-schemas";
import { Model } from "mongoose";

@Injectable() export class HistoryService {
	constructor(@InjectModel("History") private readonly historyCollection: Model<HistoryDocument>) {}
	/**
	 * Finds user's History items in database (filtered by FileType and owner)
	 * @param U_ID user's _id property
	 * @param owner post owner
	 * @param category post category
	 * @param type post type
	 * @returns History items array
	 */
	async getFilteredHistory(U_ID: string, type: FileType | "all", category: string, owner: string): Promise<History[]> {
		try {
			let filter: object = { U_ID };
			if (type !== "all") filter = {...filter, type};
			if (category !== "all" && category !== "none") {
				filter = {...filter, categories: category}
			} else if (category === "none") {
				filter = {
					...filter,
					categories: {
						$in: [undefined, []]
					}
				}
			}
			if (owner !== "all") filter = {...filter, owner: new RegExp(owner, "i")};
			return (await this.historyCollection.find(filter).exec()).reverse();
		} catch (error) {
			throw new Error(error.message as string);
		}
	}
	/**
	 * Adds/updates history item to database (according to https://mongoosejs.com/docs/tutorials/findoneandupdate.html)
	 * @param _id History item ID
	 * @param U_ID user ID
	 * @param item History item core properties
	 * @returns added History item
	 */
	async addHistoryItem(
		U_ID: string,
		urls: string[],
		type: FileType,
		owner: string,
		post: string
	): Promise<History> {
		try {
			return this.historyCollection.findOneAndUpdate({
				_id: `${type}/${owner}/${post}`,
				U_ID
			},{
				urls,
				type,
				owner,
				post,
				date: new Date(),
				categories: []
			},{
				new: true,
				upsert: true
			}).exec();
		} catch (error) {
			throw new Error(error.message as string);
		}
	}
	/**
	 * Gets History item by ID
	 * @param _id History item ID
	 * @param U_ID user ID
	 */
	async getHistoryItemBy_ID(_id: string, U_ID: string): Promise<History> {
		try {
			return this.historyCollection.findOne({ _id, U_ID });
		} catch (error) {
			throw new Error(error.message as string);
		}
	}
	/**
	 * Gets History item by ID
	 * @param type post type
	 * @param post History item's post property
	 * @param U_ID user ID
	 */
	async getHistoryItemByPost(type: FileType, post: string, U_ID: string): Promise<History> {
		try {
			return this.historyCollection.findOne({ type, post, U_ID });
		} catch (error) {
			throw new Error(error.message as string);
		}
	}
	/**
	 * Gets History item by ID
	 * @param url History item's post file URL
	 * @param U_ID user ID
	 */
	async getHistoryItemByURL(url: string, U_ID: string): Promise<History> {
		try {
			return await this.historyCollection.findOne({ urls: url, U_ID });
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
	/**
	 * Removes URL from History urls field
	 * @param url file URL from History urls field
	 */
	async deleteHistoryURL(url: string): Promise<History> {
		try {
			return this.historyCollection.findOneAndUpdate({
				urls: `storage/${url}`
			}, {
				$pull: {
					urls: `storage/${url}`
				}
			},{
				new: true
			});
		} catch (error) {
			throw new Error(error.message as string);
		}
	}

	async editHistoryCategories(type: FileType, owner: string, post: string, categories: string[]): Promise<History> {
		try {
			let history = await this.historyCollection.findOne({ type, owner, post });
			history.categories = categories;
			await history.save();
			return history;
		} catch (error) {
			throw new Error(error.message as string);
		}
	}
}