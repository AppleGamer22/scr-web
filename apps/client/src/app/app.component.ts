import { Component } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router, NavigationEnd, NavigationStart } from "@angular/router";
import { environment } from "../environments/environment";
import { ToastService } from "./toast.service";

@Component({
	selector: "scr-web-root",
	templateUrl: "./app.component.html",
	styleUrls: ["./app.component.scss"],
}) export class AppComponent {
	instagram = false;
	version = "";

	constructor(
		readonly router: Router,
		private readonly http: HttpClient,
		readonly toast: ToastService
	) {
		router.events.subscribe(event => {
			if (event instanceof NavigationEnd || event instanceof NavigationStart) {
				if (localStorage.getItem("instagram")) {
					this.instagram = true;
				}
			}
		});
		this.getVersion();
	}

	async getVersion() {
		try {
			this.version = (await this.http.get<{version: string}>(`${environment.server}/api/version`).toPromise()).version;
		} catch ({ error }) {
			console.error(error);
			this.toast.showToast(error, "danger");
		}
	}
}
