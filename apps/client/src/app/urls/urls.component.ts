import { Component, Input, DoCheck } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { History } from "@scr-web/server-schemas";
import { environment } from "../../environments/environment";
import { ToastService } from "../toast.service";

@Component({
	selector: "scr-web-urls",
	templateUrl: "./urls.component.html",
	styleUrls: ["./urls.component.scss"],
}) export class URLsComponent {
	@Input() urls: string[];
	@Input() categories: string[]// = ["a", "b"];
	checked = false;
	constructor(private readonly http: HttpClient, readonly toast: ToastService) {}

	async deleteFile(url: string) {
		try {
			this.urls = (await this.http.delete<History>(url).toPromise()).urls.map(url => `${environment.server}/api/${url}`);
		} catch ({ error }) {
			console.error(error);
			this.toast.showToast(error, "danger");
		}
	}
}
