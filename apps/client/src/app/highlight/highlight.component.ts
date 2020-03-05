import { Component } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { ToastService } from "../toast.service";

@Component({
	selector: "scr-web-highlight",
	templateUrl: "./highlight.component.html",
	styleUrls: ["./highlight.component.scss"],
}) export class HighlightComponent {
	highlightID: string
	highlightNumber: number;
	processing = false;
	urls: string[];
	constructor(private readonly http: HttpClient, readonly toast: ToastService) {}

	async submit(id: string, number: number) {
		this.processing = true;
		try {
			const token = localStorage.getItem("instagram")
			if (token) {
				const headers = new HttpHeaders({"Authorization": token});
				if (id && number) {
					this.urls = await this.http.get<string[]>(`http://localhost:4100/api/highlight/${id}/${number}`, { headers }).toPromise();
					this.processing = false;
				} else {
					this.processing = false;
					await this.toast.showToast("Please enter a post ID.", "danger");
				}
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
