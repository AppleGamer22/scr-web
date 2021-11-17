// tslint:disable-next-line: nx-enforce-module-boundaries
import { History, FileType } from "@scr-web/client-schemas";
import { Component } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { ActivatedRoute, Router } from "@angular/router";
import { IonInfiniteScroll } from "@ionic/angular";
import { environment } from "../../environments/environment";
import { ToastService } from "../toast.service";

@Component({
	selector: "scr-web-history",
	templateUrl: "./history.component.html",
	styleUrls: ["./history.component.scss"],
}) export class HistoryComponent {
	processing = false;
	type: FileType | "all" = "all";
	search = "";
	response: History[];
	histories: History[][];
	categories: string[];
	selectedCategory = "all";
	constructor(
		private readonly http: HttpClient,
		readonly toast: ToastService,
		// @Inject(DOCUMENT) private document: Document,
		route: ActivatedRoute,
		private router: Router,
	) {
		this.type = (route.snapshot.queryParamMap.get("type") as FileType | "all") || "all";
		this.search = route.snapshot.queryParamMap.get("search") === "all" ? "" : route.snapshot.queryParamMap.get("search");
		this.getCategories();
		this.selectedCategory = route.snapshot.queryParamMap.get("category");
		this.filterHistories(this.type, this.selectedCategory || "all", this.search);
	}
	/**
	 * Get the history for a particular resource type
	 * @param type post type
	 * @param category post category
	 * @param search post owner
	 * @param search post owner
	 */
	async filterHistories(type: FileType | "all", category: string, search: string) {
		this.processing = true;
		if (search === "" || search === null) search = "all";
		if (category === null) {
			this.selectedCategory = "all";
			category = "all";
		}
		try {
			await this.router.navigate(["/history"], {queryParams: { type, category, search }, queryParamsHandling: "merge"});
			this.response = await this.http.get<History[]>(`${environment.server}/api/history/${type}/${category}/${search}`).toPromise();
			this.histories = [];
			for (let i = 0; i < 3 && this.response.length; i++) {
				this.histories.push(this.response.splice(0, 3).map(history => {
					history.urls = history.urls.map(url => `${environment.server}/api/${url}`);
					return history;
				}));
			}
		} catch ({ error }) {
			console.error(error);
			this.toast.showToast(error, "danger");
		}
		this.processing = false;
	}

	sliceHistory(event: Event) {
		// @ts-ignore
		let target = event.target as IonInfiniteScroll;
		if (!this.response.length) {
			target.disabled = true;
			return;
		}
		for (let i = 0; i < 3 && this.response.length; i++) {
			this.histories.push(this.response.splice(0, 3).map(history => {
				history.urls = history.urls.map(url => `${environment.server}/api/${url}`);
				return history;
			}));
		}
		target.complete();
	}

	/** gets user-assigned post categories from server */
	async getCategories() {
		try {
			this.categories = await this.http.get<string[]>(`${environment.server}/api/auth/categories`).toPromise();
		} catch ({ error }) {
			console.error(error);
			this.toast.showToast(error, "danger");
		}
	}

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
