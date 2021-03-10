import { Component, Input } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { History } from "@scr-web/server-schemas";
import { environment } from "../../environments/environment";
import { ToastService } from "../toast.service";

@Component({
	selector: "scr-web-urls",
	templateUrl: "./urls.component.html",
	styleUrls: ["./urls.component.scss"],
}) export class URLsComponent {
	// @Input() urls: string[];
	// @Input() categories: string[];
	@Input() history: History;
	options: string[];
	checked = false;

	constructor(private readonly http: HttpClient, readonly toast: ToastService) {
		this.history.urls = this.history.urls.map(url => `${environment.server}/api/${url}`);
		this.getCategories();
	}

	async deleteFile(url: string) {
		try {
			this.history.urls = (await this.http.delete<History>(url).toPromise()).urls.map(url => `${environment.server}/api/${url}`);
		} catch ({ error }) {
			console.error(error);
			this.toast.showToast(error, "danger");
		}
	}

	async getCategories() {
		try {
			const token = localStorage.getItem("instagram");
			if (token !== undefined) {
				const headers = new HttpHeaders({"Authorization": token});
				this.options = await this.http.get<string[]>(`${environment.server}/api/auth/categories`, { headers }).toPromise();
			}
		} catch ({ error }) {
			console.error(error);
			this.toast.showToast(error, "danger");
		}
	}
}
