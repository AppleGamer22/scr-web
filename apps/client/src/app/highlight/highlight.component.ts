import { Component, Inject } from "@angular/core";
import { DOCUMENT } from "@angular/common";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Router, ActivatedRoute } from "@angular/router";
import { History } from "@scr-web/client-schemas";
import { environment } from "../../environments/environment";
import { ToastService } from "../toast.service";

@Component({
	selector: "scr-web-highlight",
	templateUrl: "./highlight.component.html",
	styleUrls: ["./highlight.component.scss"],
}) export class HighlightComponent {
	highlightID: string
	highlightNumber: number;
	processing = false;
	history: History;
	constructor(
		private readonly http: HttpClient,
		@Inject(DOCUMENT) private document: Document,
		private router: Router,
		route: ActivatedRoute,
		readonly toast: ToastService
	) {
		const id = route.snapshot.queryParamMap.get("id");
		const number = Number(route.snapshot.queryParamMap.get("number"));
		if (id !== null) {
			this.highlightID = id;
			this.highlightNumber = number;
			this.submit(id, number);
		}
	}
	/**
	 * Sends a GET request to the server for the URL(s) of the requested highlight
	 * @param id highlight ID
	 * @param number highlight number
	 */
	async submit(id: string, number: number) {
		if (this.history !== undefined) this.history.urls = [];
		this.processing = true;
		await this.router.navigate(["/highlight"], {queryParams: { id, number }, queryParamsHandling: "merge"});
		try {
			if (id && number) {
				this.history = await this.http.get<History>(`${environment.server}/api/highlight/${id}/${number}`).toPromise();
				await this.toast.showToast(`${this.history.urls.length} URL(s)`, "success");
				// for (const path of this.history.urls) this.urls.push(`${environment.server}/api/${path}`);
			} else {
				await this.toast.showToast("Please enter a post ID.", "danger");
			}
		} catch ({ error }) {
			console.error(error);
			this.toast.showToast(error, "danger");
		}
		this.processing = false;
	}
}
