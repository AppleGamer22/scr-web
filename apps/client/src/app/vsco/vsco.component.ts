import { Component, Inject } from "@angular/core";
import { DOCUMENT } from "@angular/common";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Router, ActivatedRoute } from "@angular/router";
import { History } from "@scr-web/client-schemas";
import { environment } from "../../environments/environment";
import { ToastService } from "../toast.service";

@Component({
	selector: "scr-web-vsco",
	templateUrl: "./vsco.component.html",
	styleUrls: ["./vsco.component.scss"],
}) export class VSCOComponent {
	postOwner: string;
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
		const owner = route.snapshot.queryParamMap.get("owner");
		const id = route.snapshot.queryParamMap.get("id");
		if (id !== null) {
			this.postOwner = owner;
			this.postID = id;
			this.submit(owner, id);
		}
	}
	/**
	 * Sends a GET request to the server for the URL(s) of the requested post
	 * @param owner post owner
	 * @param id post ID
	 */
	async submit(owner: string, id: string) {
		if (this.history !== undefined) this.history.urls = [];
		this.processing = true;
		await this.router.navigate(["/vsco"], {queryParams: { owner, id }, queryParamsHandling: "merge"});
		try {
			const token = localStorage.getItem("instagram");
			if (token) {
				const headers = new HttpHeaders({"Authorization": token});
				if (owner && id) {
					this.history = await this.http.get<History>(`${environment.server}/api/vsco/${owner}/${id}`, { headers }).toPromise();
					await this.toast.showToast("1 URL", "success");
					// this.urls = [`${environment.server}/api/${path}`];
				} else {
					await this.toast.showToast("Please enter a post owner & ID.", "danger");
				}
			}
		} catch ({ error }) {
			console.error(error);
			this.toast.showToast(error, "danger");
		}
		this.processing = false;
	}
}
