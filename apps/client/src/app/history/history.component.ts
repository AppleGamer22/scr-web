import { History } from "@scr-gui/server-schemas";
import { Component } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { ToastService } from "../toast.service";

@Component({
	selector: "scr-gui-history",
	templateUrl: "./history.component.html",
	styleUrls: ["./history.component.scss"],
})
export class HistoryComponent {
	processing = false;
	histories: History[]
	constructor(private readonly http: HttpClient, readonly toast: ToastService) {
		this.getHistory()
	}

	async getHistory() {
		this.processing = true;
		try {
			const token = localStorage.getItem("instagram");
			if (token) {
				const headers = new HttpHeaders({"Authorization": token});
				this.histories = await this.http.get<History[]>("http://localhost:4100/api/history/", { headers }).toPromise();
				console.log(this.histories);
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
}
