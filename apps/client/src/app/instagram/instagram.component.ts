import { Component } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";

@Component({
	selector: "scr-gui-instagram",
	templateUrl: "./instagram.component.html",
	styleUrls: ["./instagram.component.scss"],
}) export class InstagramComponent {
	postID: string;
	urls: Observable<string[]>;
	constructor(private readonly http: HttpClient) {}
	async submit() {
		const headers = new HttpHeaders({"Authorization": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFwcGxlZ2FtZXIyMi5vYiIsIlVfSUQiOiI1ZGExOWRkZDJhZDVhMDBmMmM3YjUyMDUiLCJpYXQiOjE1NzA5NTM3Mjd9.igUv2iJONioQmBmCuI2Qej--qVdMulYKK-EySU1qf6w"});
		if (this.postID) this.urls = this.http.get<string[]>(`/api/instagram/${this.postID}`, { headers })
	}
}
