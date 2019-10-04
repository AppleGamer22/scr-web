import { Component, Inject } from "@angular/core";
import { DOCUMENT } from '@angular/common';

@Component({
	selector: "scr-gui-theme-toggle",
	templateUrl: "./theme-toggle.component.html",
	styleUrls: ["./theme-toggle.component.scss"],
}) export class ThemeToggleComponent {
	dark = false;
	disabled = true;
	constructor(@Inject(DOCUMENT) private document: Document) {
		this.dark = JSON.parse(localStorage.getItem("dark")) || false;
		window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", event => this.dark = event.matches);
		window.matchMedia("(prefers-color-scheme: no-preference)").addEventListener("change", event => this.disabled = !event.matches);
		this.setTheme();
	}
	readonly setTheme = ()  => {
		localStorage.setItem("dark", String(this.dark));
		if (this.dark) {
			this.document.querySelector("ion-app").classList.add("dark-theme");
		} else if (!this.dark) {
			this.document.querySelector("ion-app").classList.remove("dark-theme");
		}
	}
}
