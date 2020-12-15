import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema() export class User {
	@Prop({unique: true, required: true}) username: string;
	@Prop({required: true}) hash: string;
	@Prop({required: true}) joined: Date;
	@Prop({required: true}) network: "instagram" | "vsco" | "tiktok";
	@Prop({required: true}) instagram: boolean;
}
export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);

export enum FileType {
	Instagram = "instagram",
	Highlight = "highlight",
	Story = "story",
	VSCO = "vsco",
	TikTok = "tiktok"
}
@Schema() export class History  {
	@Prop({required: true}) _id: string;
	@Prop({required: true}) urls: string[];
	@Prop({required: true}) U_ID: string;
	@Prop({required: true}) type: FileType;
	@Prop({required: true}) owner: string;
	@Prop({required: true}) post: string;
	@Prop({required: true}) date: Date;
}
export type HistoryDocument = History & Document;
export const HistorySchema = SchemaFactory.createForClass(History);