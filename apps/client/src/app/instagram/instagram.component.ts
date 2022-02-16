import { Component } from "@angular/core";
// import { DOCUMENT } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { Router, ActivatedRoute } from "@angular/router";
import { Title } from "@angular/platform-browser";
import { History } from "@scr-web/client-schemas";
import { environment } from "../../environments/environment";
import { ToastService } from "../toast.service";

@Component({
	selector: "scr-web-instagram",
	templateUrl: "./instagram.component.html",
	styleUrls: ["./instagram.component.scss"],
}) export class InstagramComponent {
	postID: string;
	incognito = false;
	processing = false;
	history: History;
	constructor(
		private readonly http: HttpClient,
		// @Inject(DOCUMENT) private document: Document,
		private router: Router,
		route: ActivatedRoute,
		readonly toast: ToastService,
		private titleService: Title
	) {
		titleService.setTitle("scr-web/instagram");
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
		this.titleService.setTitle("scr-web/instagram");
		await this.router.navigate(["/instagram"], {queryParams: { id }, queryParamsHandling: "merge"});
		try {
			if (id) {
				this.history = await this.http.get<History>(`${environment.server}/api/instagram/${id}`, {
					params: {
						incognito: this.incognito
					}
				}).toPromise();
				await this.router.navigate(["/instagram"], {queryParams: {owner: this.history.owner, id}, queryParamsHandling: "merge"});
				this.titleService.setTitle(`scr-web/${this.history._id}`);
				this.toast.showToast(`${this.history.urls.length} URL(s)`, "success");
				// for (const path of paths) this.urls.push(`${environment.server}/api/${path}`);
			} else {
				this.toast.showToast("Please enter a post ID.", "danger");
			}
		} catch ({ error }) {
			console.error(error);
			this.titleService.setTitle("scr-web/instagram");
			this.toast.showToast(error, "danger");
		}
		this.processing = false;
	}
}
