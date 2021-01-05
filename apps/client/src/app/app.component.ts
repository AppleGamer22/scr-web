import { Component } from "@angular/core";
import { Router, NavigationEnd, NavigationStart } from "@angular/router";

@Component({
	selector: "scr-web-root",
	templateUrl: "./app.component.html",
	styleUrls: ["./app.component.scss"],
}) export class AppComponent {
	instagram = false;
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
