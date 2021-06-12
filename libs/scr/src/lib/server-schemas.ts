import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { FileType } from "./client-schemas";

@Schema() export class User {
	@Prop({unique: true, required: true}) username: string;
	@Prop({required: true}) hash: string;
	@Prop({required: true}) joined: Date;
	@Prop({required: true}) network: "instagram" | "vsco" | "tiktok";
	@Prop({required: true}) instagram: boolean;
	@Prop({required: false}) categories: string[];
}
export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);

@Schema() export class History {
	@Prop({type: String}) _id: string;
	@Prop({required: true, type: [String]}) urls: string[];
	@Prop({required: true, type: String}) U_ID: string;
	@Prop({required: true, type: FileType}) type: FileType;
	@Prop({required: true, type: String}) owner: string;
	@Prop({required: true, type: String}) post: string;
	@Prop({required: true, type: Date}) date: Date;
	@Prop({required: false, type: [String]}) categories: string[];
}
export type HistoryDocument = History & Document;
export const HistorySchema = SchemaFactory.createForClass(History);