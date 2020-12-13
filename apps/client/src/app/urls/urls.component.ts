import { Component, Input } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { History } from "@scr-web/server-schemas";

@Component({
	selector: "scr-web-urls",
	templateUrl: "./urls.component.html",
	styleUrls: ["./urls.component.scss"],
}) export class URLsComponent {
	@Input() urls: string[];
	constructor(private readonly http: HttpClient) {}

	async deleteFile(url: string) {
		try {
			this.urls = (await this.http.delete<History>(url).toPromise()).urls;
		} catch (error) {
			console.error(error);
		}
	}
}
