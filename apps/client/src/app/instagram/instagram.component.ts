import { Component, Inject } from "@angular/core";
import { DOCUMENT } from "@angular/common";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Router, ActivatedRoute } from "@angular/router";
import { History } from "@scr-web/client-schemas";
import { environment } from "../../environments/environment";
import { ToastService } from "../toast.service";

@Component({
	selector: "scr-web-instagram",
	templateUrl: "./instagram.component.html",
	styleUrls: ["./instagram.component.scss"],
}) export class InstagramComponent {
	postID: string;
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
		if (id !== null) {
			this.postID = id;
			this.submit(id);
		}
	}
	/**
	 * Sends a GET request to the server for the URL(s) of the requested post
	 * @param id post ID
	 */
	async submit(id: string) {
		if (this.history !== undefined) this.history.urls = [];
		this.processing = true;
		await this.router.navigate(["/instagram"], {queryParams: { id }, queryParamsHandling: "merge"});
		try {
			const token = localStorage.getItem("instagram");
			if (token) {
				const headers = new HttpHeaders({"Authorization": token});
				if (id) {
					this.history = await this.http.get<History>(`${environment.server}/api/instagram/${id}`, { headers }).toPromise();
					await this.toast.showToast(`${this.history.urls.length} URL(s)`, "success");
					// for (const path of paths) this.urls.push(`${environment.server}/api/${path}`);
				} else {
					await this.toast.showToast("Please enter a post ID.", "danger");
				}
			} else {
				await this.toast.showToast("You are not authenticated.", "danger");
			}
		} catch ({ error }) {
			console.error(error);
			this.toast.showToast(error, "danger");
		}
		this.processing = false;
	}
}
