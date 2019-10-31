import { Component } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { ToastService } from "../toast.service";

@Component({
	selector: "scr-gui-instagram",
	templateUrl: "./instagram.component.html",
	styleUrls: ["./instagram.component.scss"],
}) export class InstagramComponent {
	postID: string;
	processing = false;
	urls: string[];
	constructor(private readonly http: HttpClient, readonly toast: ToastService) {}

	async submit(id: string) {
		this.processing = true;
		try {
			const token = localStorage.getItem("instagram");
			if (token) {
				const headers = new HttpHeaders({"Authorization": token});
				if (id) {
					this.urls = await this.http.get<string[]>(`/api/instagram/${id}`, { headers }).toPromise();
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
