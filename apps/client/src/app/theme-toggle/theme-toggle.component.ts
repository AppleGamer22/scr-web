import { Component, Inject } from "@angular/core";
import { DOCUMENT } from "@angular/common";

@Component({
	selector: "scr-web-theme-toggle",
	templateUrl: "./theme-toggle.component.html",
	styleUrls: ["./theme-toggle.component.scss"],
}) export class ThemeToggleComponent {
	dark = false;
	constructor(@Inject(DOCUMENT) private document: Document) {
		this.dark = JSON.parse(localStorage.getItem("dark"));
		this.setTheme();
	}
	readonly setTheme = ()  => {
		localStorage.setItem("dark", String(this.dark));
		if (this.dark) {
			this.document.querySelectorAll("ion-app").forEach(ionApp => ionApp.classList.add("dark-theme"));
		} else if (!this.dark) {
			this.document.querySelectorAll("ion-app").forEach(ionApp => ionApp.classList.remove("dark-theme"));
		}
	}
}
