import { Component } from "@angular/core";
// import { DOCUMENT } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { Router, ActivatedRoute } from "@angular/router";
import { Title } from "@angular/platform-browser";
import { History } from "@scr-web/client-schemas";
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
	history: History;

	constructor(
		private readonly http: HttpClient,
		// @Inject(DOCUMENT) private document: Document,
		private router: Router,
		route: ActivatedRoute,
		readonly toast: ToastService,
		private titleService: Title
	) {
		titleService.setTitle("scr-web/tiktok");
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
		this.titleService.setTitle("scr-web/tiktok");
		await this.router.navigate(["/tiktok"], {queryParams: { owner, id }, queryParamsHandling: "merge"});
		try {
			if (owner && id) {
				this.history = await this.http.get<History>(`${environment.server}/api/tiktok/${owner}/${id}`).toPromise();
				if (this.postOwner !== this.history.owner) {
					this.postOwner = this.history.owner;
					await this.router.navigate(["/tiktok"], {queryParams: {owner: this.postOwner, id}, queryParamsHandling: "merge"});
				}
				this.titleService.setTitle(`scr-web/${this.history._id}`);
				await this.toast.showToast("1 File", "success");
			} else {
				await this.toast.showToast("Please enter a post owner & ID.", "danger");
			}
		} catch ({ error }) {
			console.error(error);
			this.titleService.setTitle("scr-web/tiktok");
			this.toast.showToast(error, "danger");
		}
		this.processing = false;
	}
}
