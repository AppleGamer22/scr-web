import { Component, OnInit } from "@angular/core";
import { Router, NavigationEnd } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { MenuController } from "@ionic/angular";

@Component({
	selector: "scr-gui-root",
	templateUrl: "./app.component.html",
	styleUrls: ["./app.component.scss"],
}) export class AppComponent {
	currentURL = "";
	constructor(private readonly router: Router) {
		router.events.subscribe(event => {
			if (event instanceof NavigationEnd) this.currentURL = router.url;
		});
	}

	// hello$ = this.http.get<string[]>("/api/instagram/Bz2MPhPhOQu", {headers: });
}
