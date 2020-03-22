import { Component, Inject } from "@angular/core";
import { DOCUMENT } from "@angular/common";
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
	constructor(private readonly http: HttpClient, @Inject(DOCUMENT) private document: Document, readonly toast: ToastService) {}

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
