import { Component } from "@angular/core";
import { Title } from "@angular/platform-browser";

@Component({
	selector: "scr-web-license",
	templateUrl: "./license.component.html",
	styleUrls: ["./license.component.scss"],
}) export class LicenseComponent {
	constructor(private titleService: Title) {
		this.titleService.setTitle("scr-web/license");
	}
}
