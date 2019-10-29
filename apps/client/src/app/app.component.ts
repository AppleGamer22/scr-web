import { Component } from "@angular/core";
import { Router, NavigationEnd } from "@angular/router";


@Component({
	selector: "scr-gui-root",
	templateUrl: "./app.component.html",
	styleUrls: ["./app.component.scss"],
}) export class AppComponent {
	currentURL = "";
	instagram = false;
	constructor(private readonly router: Router) {
		router.events.subscribe(event => {
			if (event instanceof NavigationEnd) {
				this.currentURL = router.url;
				if (router.url === "/") {
					if (localStorage.getItem("instagram")) this.instagram = true;
				}
			}
		});
	}
}
