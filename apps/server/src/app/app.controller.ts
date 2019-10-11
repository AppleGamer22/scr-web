import { Controller, Get } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { User } from "@scr-gui/server-schemas";

@Controller() export class AppController {
	constructor(@InjectModel("Users") private readonly userCollection: Model<User>) {}
	@Get("a") async do() {
		const a = new this.userCollection({username: "a", hash: "aaaaa", joined: new  Date(), _id: new Types.ObjectId()});
		return await a.save();
	}
	@Get("b") async b() {
		const a = await this.userCollection.findById("5da01c31bfd2f52644f15ef3").exec();
		return a;
	}
}