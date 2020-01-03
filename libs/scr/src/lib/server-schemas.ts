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
	instagram: {
		type: Boolean,
		required: true
	}
});
export interface User extends Document {
	username: string,
	hash: string,
	joined: Date,
	network: "instagram" | "vsco",
	instagram: boolean
}


export const HistorySchema = new Schema({
	_id: {
		type: String,
		required: true
	},
	U_ID: {
		type: String,
		required: true
	},
	network: {
		type: String,
		required: true
	},
	urls: {
		type: [String],
		required: true
	}
});
export interface History extends Document {
	urls: string[],
	U_ID: string,
	network: "instagram" | "vsco"
}