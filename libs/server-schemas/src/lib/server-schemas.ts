import { Document, Schema } from "mongoose";

export const UserSchema = new Schema({
	_id: Schema.Types.ObjectId,
	username: {
		type: String,
		unique: true,
		required: true
	},
	hash: {
		type: String,
		required: true
	},
	joined: {
		type: Date,
		required: true
	},
	network: {
		type: String,
		required: true
	},
});

export interface User extends Document {
	username: string,
	hash: string,
	joined: Date,
	network: "instagram" | "vsco"
}

export const PostSchema = new Schema({
	_id: Schema.Types.ObjectId,
	username: {
		type: String,
		unique: true,
		required: true
	},
	URLs: {
		type: [String],
		required: true
	},
	network: {
		type: String,
		required: true
	},
});

export interface Post extends Document {
	username: string,
	URLs: string[],
	network: "instagram" | "vsco"
}