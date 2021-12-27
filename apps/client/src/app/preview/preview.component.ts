import { Component, Input, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { History } from "@scr-web/client-schemas";
import { environment } from "../../environments/environment";
import { ToastService } from "../toast.service";

@Component({
	selector: "scr-web-preview",
	templateUrl: "./preview.component.html",
	styleUrls: ["./preview.component.scss"],
}) export class PreviewComponent {
	constructor(private readonly http: HttpClient, readonly toast: ToastService) {}

	private _i = 0;
	get i(): number {
		return this._i;
	}
	set i(value: number) {
		if (0 <= value && value < this.history.urls.length) {
			this._i = value;
		}
	}

	private _history: History;
	get history(): History {
		return this._history;
	}
	@Input() set history(value: History) {
		if (value !== undefined) {
			value.urls = value.urls.map(url => {
				if (!url.startsWith(environment.server)) {
					return `${environment.server}/api/${url}`;
				} else {
					return url;
				}
			});
			this._history = value;
		}
	}
	@Input() categories: string[];


	async onCategoryChange(event: Event, history: History) {
		try {
			const categories: string[] = (event as CustomEvent).detail.value;
			if (history !== undefined && history.categories !== categories) {
				const url = `${environment.server}/api/history/${history.type}/${history.owner}/${history.post}`;
				if (history.type === "story") {
					const url = `${environment.server}/api/history/${history.type}/${history._id}`;
				}
				history = await this.http.patch<History>(url, { categories }).toPromise();
			}
		} catch ({ error }) {
			console.error(error);
			this.toast.showToast(error, "danger");
		}
	}
}
