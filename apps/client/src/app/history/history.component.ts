// tslint:disable-next-line: nx-enforce-module-boundaries
import { History } from "@scr-web/server-schemas";
import { Component, Inject } from "@angular/core";
import { DOCUMENT } from "@angular/common";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { ActivatedRoute, Router } from "@angular/router";
import { FileType } from "@scr-web/server-schemas";
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
	constructor(
		private readonly http: HttpClient,
		readonly toast: ToastService,
		@Inject(DOCUMENT) private document: Document,
		route: ActivatedRoute,
		private router: Router,
	) {
		this.type = (route.snapshot.queryParamMap.get("type") as FileType | "all") || "all";
		this.search = route.snapshot.queryParamMap.get("search") || "";
		if (this.search === "") {
			this.filterHistoriesByType(this.type);
		} else {
			this.filterHistoryByOwner(this.search);
		}
	}
	/**
	 * Get the history for a particular resource type
	 */
	async filterHistoriesByType(type: FileType | "all") {
		this.processing = true;
		try {
			const token = localStorage.getItem("instagram");
			if (token) {
				await this.router.navigate(["/history"], {queryParams: { type }, queryParamsHandling: "merge"});
				const headers = new HttpHeaders({"Authorization": token});
				this.response = await this.http.get<History[]>(`${environment.server}/api/history/${type}`, { headers }).toPromise();
				this.response = this.response.map(history => {
					history.urls = history.urls.map(url => `${environment.server}/api/${url}`);
					return history;
				});
				this.histories = this.response.slice(this.range, this.range + 10);
				this.range += 10;
			} else {
				await this.toast.showToast("You are not authenticated.", "danger");
			}
		} catch (error) {
			console.error((error as Error).message);
			this.toast.showToast((error as Error).message, "danger");
		}
		this.processing = false;
	}
	/**
	 * @param search owner search query
	 * @returns a filtered list of history items with owner substring
	 */
	async filterHistoryByOwner(search: string) {
		try {
			const token = localStorage.getItem("instagram");
			if (token) {
				await this.router.navigate(["/history"], {queryParams: {type: this.type, search}, queryParamsHandling: "merge"});
				const headers = new HttpHeaders({"Authorization": token})
				this.response = await this.http.get<History[]>(`${environment.server}/api/history/${this.type}`, { headers }).toPromise();
				this.response = this.response.map(history => {
					history.urls = history.urls.map(url => `${environment.server}/api/${url}`);
					return history;
				}).filter(history => history.owner.includes(search));
				this.range = 0;
				this.histories = [];
				this.histories.push(...this.response.slice(this.range, this.range + 10));
				console.log(this.histories);
			}
		} catch (error) {
			console.error((error as Error).message);
			this.toast.showToast((error as Error).message, "danger");
		}
	}
	sliceHistory(event) {
		this.histories.push(...this.response.slice(this.range, this.range + 10));
		this.range += 10;
		event.target.complete();
		if (this.range >= this.response.length) event.target.disabled = true;
	}
}
