import { Component, Inject } from "@angular/core";
import { DOCUMENT } from "@angular/common";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Router, ActivatedRoute } from "@angular/router";
import { environment } from "../../environments/environment";
import { ToastService } from "../toast.service";

@Component({
	selector: "scr-web-tiktok",
	templateUrl: "./tiktok.component.html",
	styleUrls: ["./tiktok.component.scss"],
})
export class TikTokComponent {
	postOwner: string;
	postID: string;
	processing = false;
	src: string;

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
		this.processing = true;
		await this.router.navigate(["/tiktok"], {queryParams: { owner, id }, queryParamsHandling: "merge"});
		try {
			const token = localStorage.getItem("instagram");
			if (token) {
				const headers = new HttpHeaders({"Authorization": token});
				if (owner && id) {
					const { path } = await this.http.get<{path: string}>(`${environment.server}/api/tiktok/${owner}/${id}`, { headers }).toPromise();
					await this.toast.showToast("1 URL", "success");
					this.src = `${environment.server}/api/${path}`;
				} else {
					await this.toast.showToast("Please enter a post ownder & ID.", "danger");
				}

			}
		} catch (error) {
			console.error((error as Error).message);
			this.toast.showToast((error as Error).message, "danger");
		}
		this.processing = false;
	}
}
