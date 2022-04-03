import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectModel } from "@nestjs/mongoose";
import { User, UserDocument } from "@scr-web/server-schemas";
import { beginScrape } from "@scr-web/server-interfaces";
import { Model, Types } from "mongoose";
import { hash, compare } from "bcryptjs";
import { InstagramService } from "../instagram/instagram.service";

@Injectable() export class AuthService {
	constructor(
		@InjectModel("Users") private readonly userCollection: Model<UserDocument>,
		private readonly jwt: JwtService,
		private readonly instagramService: InstagramService
	) {}
	/**
	 * Signs-up Instagram user based on credentials
	 * @param username user's username
	 * @param password user's password
	 * @returns A User database object
	 */
	async signUpInstagram(username: string, password: string): Promise<User> {
		try {
			const possibleUser = await this.userCollection.findOne({username}).exec();
			if (possibleUser) throw new Error( "Username already exists.");
			return new this.userCollection({
				username,
				hash: await hash(password, 10),
				joined: new Date(),
				network: "instagram",
				instagram: false,
				_id: new Types.ObjectId()
			}).save();
		} catch (error) {
			throw new Error(error.message);
		}
	}
	/**
	 * Signs-in Instagram user based on credentials
	 * @param username user's username
	 * @param password user's password
	 * @returns A JSON Web Token
	 */
	async signInInstagram(username: string, password: string): Promise<string | undefined> {
		try {
			const possibleUser = await this.userCollection.findOne({username}).exec();
			if (!possibleUser) throw new Error("Authentication failed.");
			const isRealUser = await compare(password, possibleUser.hash);
			if (!isRealUser) throw new Error("Authentication failed.");
			const webToken = await this.jwt.signAsync({username, U_ID: `${possibleUser._id}`});
			const { browser, page } = await beginScrape(`${possibleUser._id}`);
			if (isRealUser && possibleUser.instagram) {
				await browser.close();
				return webToken;
			} else if (await this.instagramService.signIn(browser, page, username, password)) {
				possibleUser.instagram = true;
				await possibleUser.save();
				await browser.close();
				return webToken;
			}
		} catch (error) {
			throw new Error(error.message as string);
		}
	}
	/**
	 * Signs-out Instagram user based on credentials
	 * @param U_ID user's _id property
	 * @returns success Boolean
	 */
	async signOutInstagram(U_ID: string): Promise<{authenticated: boolean} | undefined> {
		try {
			const possibleUser = await this.userCollection.findById(U_ID).exec();
			if (!possibleUser) throw new Error("Unauthentication failed.");
			const { browser, page } = await beginScrape(possibleUser._id);
			if (possibleUser.instagram && await this.instagramService.signOut(page, possibleUser.username)) {
				await this.userCollection.findByIdAndUpdate(U_ID, {instagram: false}).exec();
				await browser.close();
				return {authenticated: false};
			}
		} catch (error) {
			throw new Error(error.message as string);
		}
	}
	/**
	 * Edits user's category list
	 * @param U_ID user's _id property
	 * @param categories an array of categories
	 * @returns a new array of categories
	 */
	async editCategories(U_ID: string, categories: string[]): Promise<string[]> {
		try {
			await this.userCollection.findOneAndUpdate({_id: U_ID}, { categories });
			return categories;
		} catch (error) {
			throw new Error(error.message as string);
		}
	}
	/**
	 * Retrieves user's category list
	 * @param U_ID user's _id property
	 * @param categories an array of categories
	 * @returns a new array of categories
	 */
	async getCategories(U_ID: string): Promise<string[]> {
		try {
			const { categories } = await this.userCollection.findById(U_ID);
			return categories;
		} catch (error) {
			throw new Error(error.message as string);
		}
	}
}