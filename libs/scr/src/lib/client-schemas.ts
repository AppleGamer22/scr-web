export enum FileType {
	Instagram = "instagram",
	Highlight = "highlight",
	Story = "story",
	VSCO = "vsco",
	TikTok = "tiktok"
}

export interface User {
	_id: string;
	username: string;
	hash: string;
	joined: Date;
	network: "instagram" | "vsco" | "tiktok";
	instagram: boolean;
	categories: string[];
}

export interface History {
	_id: string;
	urls: string[];
	U_ID: string;
	type: FileType;
	owner: string;
	post: string;
	date: Date;
	categories: string[];
}