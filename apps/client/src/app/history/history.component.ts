// tslint:disable-next-line: nx-enforce-module-boundaries
import { History } from "@scr-web/client-schemas";
import { Component, Inject } from "@angular/core";
import { DOCUMENT } from "@angular/common";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { ActivatedRoute, Router } from "@angular/router";
import { FileType } from "@scr-web/client-schemas";
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
		// @Inject(DOCUMENT) private document: Document,
		route: ActivatedRoute,
		private router: Router,
	) {
		this.type = (route.snapshot.queryParamMap.get("type") as FileType | "all") || "all";
		this.search = route.snapshot.queryParamMap.get("search");
		this.filterHistories(this.type, this.search || "all");
	}
	/**
	 * Get the history for a particular resource type
	 * @param type post type
	 * @param search post owner
	 */
	async filterHistories(type: FileType | "all", search: string) {
		this.processing = true;
		try {
			const token = localStorage.getItem("instagram");
			if (token) {
				await this.router.navigate(["/history"], {queryParams: { type, search }, queryParamsHandling: "merge"});
				const headers = new HttpHeaders({"Authorization": token});
				this.response = await this.http.get<History[]>(`${environment.server}/api/history/${type}/${search}`, { headers }).toPromise();
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

	sliceHistory(event) {
		if (this.range >= this.response.length) {
			event.target.disabled = true;
			return;
		}
		this.histories.push(...this.response.slice(this.range, this.range + 10));
		this.range += 10;
		event.target.complete();
	}
}
