import { Component, OnInit } from "@angular/core";
import { Router, NavigationStart } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { MenuController } from "@ionic/angular";

@Component({
	selector: "scr-gui-root",
	templateUrl: "./app.component.html",
	styleUrls: ["./app.component.scss"],
}) export class AppComponent {
	constructor() {}

	// hello$ = this.http.get<string[]>("/api/instagram/Bz2MPhPhOQu", {headers: new HttpHeaders({"Authorization": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFwcGxlZ2FtZXIyMi5vYiIsIlVfSUQiOiI1ZGExOWRkZDJhZDVhMDBmMmM3YjUyMDUiLCJpYXQiOjE1NzA5NTM3Mjd9.igUv2iJONioQmBmCuI2Qej--qVdMulYKK-EySU1qf6w"})});
}
