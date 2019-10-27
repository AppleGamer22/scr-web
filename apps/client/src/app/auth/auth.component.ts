import { Component } from "@angular/core";

@Component({
	selector: "scr-gui-auth",
	templateUrl: "./auth.component.html",
	styleUrls: ["./auth.component.scss"],
}) export class AuthComponent {
	authOption = "sign-up";
	platform: string;
	username: string;
	password: string
	constructor() {}
	signUp() {}
	signIn() {}
}
