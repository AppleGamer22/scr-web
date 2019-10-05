import { Component } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Component({
	selector: "scr-gui-root",
	templateUrl: "./app.component.html",
	styleUrls: ["./app.component.scss"],
}) export class AppComponent {
	hello$ = this.http.get<Object>("/api/hello");
	constructor(private http: HttpClient) {}
}
