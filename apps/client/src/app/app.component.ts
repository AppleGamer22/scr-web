import { Component } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Message } from "@scr-gui/server-interfaces";

@Component({
	selector: "scr-gui-root",
	templateUrl: "./app.component.html",
	styleUrls: ["./app.component.scss"],
}) export class AppComponent {
	constructor(private http: HttpClient) {}
	hello$ = this.http.get<Message>("/api/hello");
}
