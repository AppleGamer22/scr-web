// tslint:disable-next-line: nx-enforce-module-boundaries
import { History } from "@scr-web/server-schemas";
import { Component, Inject } from "@angular/core";
import { DOCUMENT } from "@angular/common";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { ToastService } from "../toast.service";

@Component({
	selector: "scr-web-history",
	templateUrl: "./history.component.html",
	styleUrls: ["./history.component.scss"],
})
export class HistoryComponent {
	processing = false;
	type: "instagram" | "highlight" | "story" | "vsco" | "all" = "all";
	histories: History[];
	constructor(private readonly http: HttpClient, readonly toast: ToastService, @Inject(DOCUMENT) private document: Document) {
		this.getHistories();
	}

	async getHistories() {
		this.processing = true;
		try {
			const token = localStorage.getItem("instagram");
			if (token) {
				const headers = new HttpHeaders({"Authorization": token});
				this.histories = await this.http.get<History[]>(`${environment.server}/api/history/${this.type}`, { headers }).toPromise();
				this.processing = false;
			} else {
				this.processing = false;
				await this.toast.showToast("You are not authenticated.", "danger");
			}
		} catch (error) {
			this.processing = false;
			console.error((error as Error).message);
			this.toast.showToast((error as Error).message, "danger");
		}
	}

	async editHistory(history: History, urlToDelete: string) {
		this.processing = true;
		try {
			const token = localStorage.getItem("instagram");
			if (token) {
				const headers = new HttpHeaders({"Authorization": token});
				await this.http.patch(`${environment.server}/api/history/`, { history, urlToDelete }, { headers }).toPromise();
				this.histories = await this.http.get<History[]>(`${environment.server}/api/history/${this.type}`, { headers }).toPromise();
				this.processing = false;
			} else {
				this.processing = false;
				await this.toast.showToast("You are not authenticated.", "danger");
			}
		} catch (error) {
			this.processing = false;
			console.error((error as Error).message);
			this.toast.showToast((error as Error).message, "danger");
		}
	}

	async filterHistory() {
		this.processing = true;
		try {
			const token = localStorage.getItem("instagram");
			if (token) {
				const headers = new HttpHeaders({"Authorization": token});
				this.histories = await this.http.get<History[]>(`${environment.server}/api/history/${this.type}`, { headers }).toPromise();
				this.processing = false;
			} else {
				this.processing = false;
				await this.toast.showToast("You are not authenticated.", "danger");
			}
		} catch (error) {
			this.processing = false;
			console.error((error as Error).message);
			this.toast.showToast((error as Error).message, "danger");
		}
	}

	async downloadFile(url: string) {
		const arrayBuffer = await this.http.get(url, {responseType: "arraybuffer"}).toPromise();
		let type: "image/jpeg" | "video/mp4";
		if (url.includes(".jpg")) {
			type = "image/jpeg"
		} else if (url.includes(".mp4")) {
			type = "video/mp4"
		}
		const blob = new Blob([arrayBuffer], { type });
		const a = this.document.createElement("a");
		a.href = URL.createObjectURL(blob);
		a.download = "";
		a.click();
	}
}
