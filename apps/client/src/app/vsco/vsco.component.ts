import { Component } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { ToastService } from "../toast.service";

@Component({
	selector: "scr-web-vsco",
	templateUrl: "./vsco.component.html",
	styleUrls: ["./vsco.component.scss"],
}) export class VSCOComponent {
	postOwner: string;
	postID: string;
	processing = false;
	urls: string[];
	constructor(private readonly http: HttpClient, readonly toast: ToastService) {}

	async submit(owner: string, id: string) {
		this.processing = true;
		try {
			if (owner && id) {
				this.urls = await this.http.get<string[]>(`http://localhost:4100/api/vsco/${owner}/${id}`).toPromise();
				this.processing = false;
			} else {
				this.processing = false;
				await this.toast.showToast("Please enter a post ownder & ID.", "danger");
			}
		} catch (error) {
			this.processing = false;
			console.error((error as Error).message);
			this.toast.showToast((error as Error).message, "danger");
		}
	}
}
