import { Component, OnInit, Inject } from "@angular/core";
import { DOCUMENT } from '@angular/common';

@Component({
	selector: "scr-gui-theme-toggle",
	templateUrl: "./theme-toggle.component.html",
	styleUrls: ["./theme-toggle.component.scss"],
}) export class ThemeToggleComponent implements OnInit {
	dark = false;
	constructor(@Inject(DOCUMENT) private document: Document) {
		this.dark = JSON.parse(localStorage.getItem("dark")) || false;
		this.setTheme();
	}
	readonly setTheme = ()  => {
		localStorage.setItem("dark", String(this.dark));
		switch (this.dark) {
			case false:
				this.document.querySelectorAll("ion-app").forEach(ionApp => ionApp.classList.remove("dark-theme"));
				break;
			default:
				this.document.querySelectorAll("ion-app").forEach(ionApp => ionApp.classList.add("dark-theme"));
				break;
		}
	}
	ngOnInit() {}
}
