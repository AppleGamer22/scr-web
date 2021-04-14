import { Component, Input } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { History } from "@scr-web/client-schemas";
import { environment } from "../../environments/environment";
import { ToastService } from "../toast.service";

@Component({
	selector: "scr-web-urls",
	templateUrl: "./urls.component.html",
	styleUrls: ["./urls.component.scss"],
}) export class URLsComponent {
	// @Input() urls: string[];
	// @Input() categories: string[];
	private _history: History;
	options: string[];
	get history(): History {
		return this._history;
	}

	@Input() set history(value: History) {
		if (value !== undefined) {
			value.urls = value.urls.map(url => {
				if (!url.startsWith(environment.server)) {
					return `${environment.server}/api/${url}`;
				}
			});
			this._history = value;
		}
	}


	constructor(private readonly http: HttpClient, readonly toast: ToastService) {
		this.getCategories();
	}

	async deleteFile(url: string) {
		try {
			this.history = await this.http.delete<History>(url).toPromise();
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

	async onCategoryChange(event: CustomEvent) {
		try {
			const token = localStorage.getItem("instagram");
			const categories: string[] = event.detail.value;
			if (token !== undefined && history !== undefined && this.history.categories !== categories) {
				const headers = new HttpHeaders({"Authorization": token});
				const url = `${environment.server}/api/history/${this.history.type}/${this.history.owner}/${this.history.post}`;
				this.history = await this.http.patch<History>(url, { categories }, { headers }).toPromise();
			}
		} catch ({ error }) {
			console.error(error);
			this.toast.showToast(error, "danger");
		}
	}
}
