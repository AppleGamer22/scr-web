import { Component } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { ToastService } from "../toast.service";

@Component({
	selector: "scr-gui-instagram",
	templateUrl: "./instagram.component.html",
	styleUrls: ["./instagram.component.scss"],
}) export class InstagramComponent {
	postID: string;
	urls: Observable<string[]>;
	constructor(private readonly http: HttpClient, readonly toast: ToastService) {}
	async submit() {
		try {
			const token = localStorage.getItem("instagram")
			if (token) {
				const headers = new HttpHeaders({"Authorization": token});
				if (this.postID) {
					this.urls = this.http.get<string[]>(`/api/instagram/${this.postID}`, { headers })
				} else await this.toast.showToast("Please enter a post ID.", "danger");
			} else await this.toast.showToast("You are not authenticated.", "danger");
		} catch (error) {
			console.error((error as Error).message);
			this.toast.showToast((error as Error).message, "danger");
		}
	}
}
