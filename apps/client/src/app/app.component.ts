import { Component } from "@angular/core";
import { Router, NavigationEnd, NavigationStart } from "@angular/router";
import { version } from "../environments/environment";

@Component({
	selector: "scr-web-root",
	templateUrl: "./app.component.html",
	styleUrls: ["./app.component.scss"],
}) export class AppComponent {
	instagram = false;
	readonly version = version

	constructor(readonly router: Router) {
		router.events.subscribe(event => {
			if (event instanceof NavigationEnd || event instanceof NavigationStart) {
				if (localStorage.getItem("instagram")) {
					this.instagram = true;
				}
			}
		});
	}
}
