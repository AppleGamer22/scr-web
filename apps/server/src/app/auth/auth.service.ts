import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectModel } from "@nestjs/mongoose";
import { User } from "@scr-gui/server-schemas";
import { beginScrape } from "@scr-gui/server-interfaces";
import { Model, Types } from "mongoose";
import { hash, compare } from "bcryptjs";
import { InstagramService } from "../instagram/instagram.service";

@Injectable() export class AuthService {
	constructor(
		@InjectModel("Users") private readonly userCollection: Model<User>,
		private readonly jwt: JwtService,
		private readonly instagramService: InstagramService
	) {}
	async signUpInstagram(username: string, password: string): Promise<User> {
		try {
			const possibleUser = await this.userCollection.findOne({username}).exec();
			if (possibleUser) throw new Error( "Username already exists.");
			return await new this.userCollection({
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
	async signInInstagram(username: string, password: string): Promise<string | undefined> {
		try {
			const possibleUser = await this.userCollection.findOne({username}).exec();
			if (!possibleUser) throw new Error("Authentication failed.");
			const isRealUser = await compare(password, possibleUser.hash);
			if (!isRealUser) throw new Error("Authentication failed.");
			const webToken = await this.jwt.signAsync({username, U_ID: possibleUser._id});
			const { browser, page } = await beginScrape(possibleUser._id);
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
}