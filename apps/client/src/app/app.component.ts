import { Component } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Events, IonRange } from "@ionic/angular";
import { Message } from "@scr-gui/server-interfaces";

@Component({
	selector: "scr-gui-root",
	templateUrl: "./app.component.html",
	styleUrls: ["./app.component.scss"],
}) export class AppComponent {
	dark = false;
	hello$ = this.http.get<Message>("/api/hello");
	constructor(private http: HttpClient) {
		this.dark = JSON.parse(localStorage.getItem("dark")) || false;
	}
	setTheme() {
		localStorage.setItem("dark", String(this.dark));
	}
}
