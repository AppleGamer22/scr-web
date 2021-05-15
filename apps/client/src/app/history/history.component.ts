// tslint:disable-next-line: nx-enforce-module-boundaries
import { History, FileType } from "@scr-web/client-schemas";
import { Component, Inject } from "@angular/core";
import { DOCUMENT } from "@angular/common";
import { HttpClient, HttpHeaders } from "@angular/common/http";
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
	range = 0;
	response: History[];
	histories: History[];
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
			const token = localStorage.getItem("instagram");
			if (token) {
				await this.router.navigate(["/history"], {queryParams: { type, category, search }, queryParamsHandling: "merge"});
				const headers = new HttpHeaders({"Authorization": token});
				this.response = await this.http.get<History[]>(`${environment.server}/api/history/${type}/${category}/${search}`, { headers }).toPromise();
				this.range = 0;
				this.histories = [];
				this.histories = this.response.slice(this.range, this.range + 10);
				this.range += 10;
			} else {
				await this.toast.showToast("You are not authenticated.", "danger");
			}
		} catch ({ error }) {
			console.error(error);
			this.toast.showToast(error, "danger");
		}
		this.processing = false;
	}

	sliceHistory(event: Event) {
		// @ts-ignore
		var target = event.target as IonInfiniteScroll
		if (this.range >= this.response.length) {
			target.disabled = true;
			return;
		}
		this.histories.push(...this.response.slice(this.range, this.range + 10));
		this.range += 10;
		target.complete();
	}

	/** gets user-assigned post categories from server */
	async getCategories() {
		try {
			const token = localStorage.getItem("instagram");
			if (token !== undefined) {
				const headers = new HttpHeaders({"Authorization": token});
				this.categories = await this.http.get<string[]>(`${environment.server}/api/auth/categories`, { headers }).toPromise();
			}
		} catch ({ error }) {
			console.error(error);
			this.toast.showToast(error, "danger");
		}
	}
}
