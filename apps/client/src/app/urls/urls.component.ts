import { Component, Input } from "@angular/core";
import { HttpClient } from "@angular/common/http";
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
			this.options = await this.http.get<string[]>(`${environment.server}/api/auth/categories`).toPromise();
		} catch ({ error }) {
			console.error(error);
			this.toast.showToast(error, "danger");
		}
	}

	async onCategoryChange(event: Event) {
		try {
			const categories: string[] = (event as CustomEvent).detail.value;
			if (history !== undefined && this.history.categories !== categories) {
				const url = `${environment.server}/api/history/${this.history.type}/${this.history.owner}/${this.history.post}`;
				if (this.history.type === "story") {
					const url = `${environment.server}/api/history/${this.history.type}/${this.history._id}`;
				}
				this.history = await this.http.patch<History>(url, { categories }).toPromise();
			}
		} catch ({ error }) {
			console.error(error);
			this.toast.showToast(error, "danger");
		}
	}
}
