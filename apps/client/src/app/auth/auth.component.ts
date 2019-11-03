import { Component } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { User } from "@scr-gui/server-schemas";
import { ToastService } from "../toast.service";

@Component({
	selector: "scr-gui-auth",
	templateUrl: "./auth.component.html",
	styleUrls: ["./auth.component.scss"],
}) export class AuthComponent {
	authOption: "sign-up" | "sign-in" | "sign-out" = "sign-up";
	platform = "instagram";
	usernameField: string;
	passwordField: string;
	processing = false;
	constructor(private readonly http: HttpClient, readonly toast: ToastService) {}

	async signUp(username: string, password: string) {
		this.processing = true;
		try {
			if (username && password) {
				const body = { username, password };
				const user = await this.http.patch<User>("/api/auth/sign_up/instagram", body).toPromise();
				this.processing = false;
				if (user !== undefined) {
					console.log("Signed-up.");
					await this.signIn(username, password);
					this.processing = false;
				}
			}
		} catch (error) {
			this.processing = false;
			console.error((error as Error).message);
			this.toast.showToast((error as Error).message, "danger");
		}
	}

	async signIn(username: string, password: string) {
		this.processing = true;
		try {
			if (username && password) {
				const body = { username, password };
				const { token } = await this.http.patch<{token: string}>("/api/auth/sign_in/instagram", body).toPromise();
				if (token !== undefined) {
					localStorage.setItem("instagram", token);
					console.log("Authenticated successfully.");
					this.processing = false;
				}
			}
		} catch (error) {
			this.processing = false;
			console.error((error as Error).message);
			this.toast.showToast((error as Error).message, "danger");
		}
	}
}
