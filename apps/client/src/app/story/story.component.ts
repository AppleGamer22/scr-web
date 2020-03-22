import { Component, Inject } from "@angular/core";
import { DOCUMENT } from "@angular/common";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastService } from "../toast.service";

@Component({
	selector: "scr-web-story",
	templateUrl: "./story.component.html",
	styleUrls: ["./story.component.scss"],
}) export class StoryComponent {
	storyID: string
	storyNumber: number;
	processing = false;
	urls: string[];
	constructor(
		private readonly http: HttpClient,
		@Inject(DOCUMENT) private document: Document,
		private router: Router,
		route: ActivatedRoute,
		readonly toast: ToastService
	) {
		const id = route.snapshot.queryParamMap.get("id");
		const number = Number(route.snapshot.queryParamMap.get("number"));
		if (id !== null) {
			this.storyID = id;
			this.storyNumber = number
			this.submit(id, number);
		}
	}

	async submit(id: string, number: number) {
		this.processing = true;
		await this.router.navigate(["/story"], {queryParams: { id, number }, queryParamsHandling: "merge"});
		try {
			const token = localStorage.getItem("instagram")
			if (token) {
				const headers = new HttpHeaders({"Authorization": token});
				if (id && number) {
					this.urls = await this.http.get<string[]>(`http://localhost:4100/api/story/${id}/${number}`, { headers }).toPromise();
				} else {
					await this.toast.showToast("Please enter a post ID.", "danger");
				}
			} else {
				await this.toast.showToast("You are not authenticated.", "danger");
			}
		} catch (error) {
			console.error((error as Error).message);
			this.toast.showToast((error as Error).message, "danger");
		}
		this.processing = false;
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
