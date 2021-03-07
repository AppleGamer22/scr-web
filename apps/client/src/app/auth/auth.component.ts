import { Component } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Router, ActivatedRoute } from "@angular/router";
// tslint:disable-next-line: nx-enforce-module-boundaries
import { User } from "@scr-web/server-schemas";
import { environment } from "../../environments/environment";
import { ToastService } from "../toast.service";

@Component({
	selector: "scr-web-auth",
	templateUrl: "./auth.component.html",
	styleUrls: ["./auth.component.scss"],
}) export class AuthComponent {
	authOption: "sign_up" | "sign_in" | "sign_out" = "sign_up";
	platform = "instagram";
	usernameField: string;
	passwordField: string;
	processing = false;
	token = localStorage.getItem(this.platform);
	categories: Array<string> = [];
	categoryField: string;
	constructor(
		private readonly http: HttpClient,
		private router: Router,
		route: ActivatedRoute,
		readonly toast: ToastService
	) {
		switch (route.snapshot.fragment) {
			case "sign_up":
			case "sign_in":
			case "sign_out":
				this.authOption = route.snapshot.fragment;
				break;
		}
	}
	/**
	 * Updates route based on selected authentication mode
	 * @param event segment change event
	 */
	async selectSegment(event: CustomEvent) {
		switch (event.detail.value) {
			case "sign_up":
			case "sign_in":
			case "sign_out":
				await this.router.navigate([], {queryParamsHandling: "merge", fragment: event.detail.value});
				break;
		}
	}
	/**
	 * Signs-up using credentials to chosen social network
	 * @param username user's username
	 * @param password user's password
	 */
	async signUp(username: string, password: string) {
		this.processing = true;
		try {
			if (username && password) {
				const body = { username, password };
				const user = await this.http.patch<User>(`${environment.server}/api/auth/sign_up/instagram`, body).toPromise();
				if (user !== undefined) {
					console.log("Signed-up.");
					this.toast.showToast("Signed-up.", "success");
					// await this.signIn(username, password);
				} else {
					console.error("Authentication failed.");
					this.toast.showToast("Authentication failed.", "danger");
				}
			}
		} catch ({ error }) {
			console.error(error);
			this.toast.showToast(error, "danger");
		}
		this.processing = false;
	}
	/**
	 * Signs-in using credentials to chosen social network
	 * @param username user's username
	 * @param password user's password
	 */
	async signIn(username: string, password: string) {
		this.processing = true;
		try {
			if (username && password) {
				const body = { username, password };
				const { token } = await this.http.patch<{token: string}>(`${environment.server}/api/auth/sign_in/instagram`, body).toPromise();
				if (token !== undefined) {
					localStorage.setItem("instagram", token);
					console.log("Authenticated successfully.");
					this.toast.showToast("Authenticated successfully.", "success");
					location.reload();
				} else {
					console.error("Authentication failed.");
					this.toast.showToast("Authentication failed.", "danger");
				}
			}
		} catch ({ error }) {
			console.error(error);
			this.toast.showToast(error, "danger");
		}
		this.processing = false;
	}
	/**
	 * Signs in from chosen social network
	 */
	async signOut() {
		this.processing = true;
		try {
			const token = localStorage.getItem("instagram");
			if (token !== undefined) {
				const headers = new HttpHeaders({"Authorization": token});
				const { status } = await this.http.patch<{status: boolean}>(`${environment.server}/api/auth/sign_out/instagram`, {}, { headers }).toPromise();
				if (!status) {
					localStorage.removeItem("instagram");
					this.toast.showToast("Deauthenticationed successfully.", "success");
					location.reload();
				} else {
					console.error("Deauthentication failed.");
					this.toast.showToast("Deauthentication failed.", "danger");
				}
			}
		} catch ({ error }) {
			console.error(error);
			this.toast.showToast(error, "danger");
		}
		this.processing = false;
	}

	addcategory() {
		try {
			if (!this.categories.includes(this.categoryField)) {
				this.categories.push(this.categoryField);
				this.categoryField = "";
			}
		} catch ({ error }) {
			console.error(error);
			this.toast.showToast(error, "danger");
		}
	}

	deletecategory(category: string) {
		try {
			if (this.categories.includes(category)) {
				this.categories = this.categories.filter(category2 => category2 !== category);
			}
		} catch ({ error }) {
			console.error(error);
			this.toast.showToast(error, "danger");
		}
	}
}
