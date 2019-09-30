import { Injectable } from "@nestjs/common";
import { Message } from "@scr-gui/server-interfaces";

@Injectable() export class AppService {
	getData(): Message {
		return { message: "Welcome to api!" };
	}
}
