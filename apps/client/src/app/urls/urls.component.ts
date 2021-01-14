import { Component, Input, DoCheck } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { History } from "@scr-web/server-schemas";
import { ImageCropperSetting } from "angular-cropperjs";
import { environment } from "../../environments/environment";
import { ToastService } from "../toast.service";

@Component({
	selector: "scr-web-urls",
	templateUrl: "./urls.component.html",
	styleUrls: ["./urls.component.scss"],
}) export class URLsComponent {
	@Input() urls: string[];
	// transforms: ImageTransform[];
	checked = false;
	constructor(private readonly http: HttpClient, readonly toast: ToastService) {}

	// ngDoCheck() {
	// 	if (!this.checked && this.urls.length > 0) {
	// 		this.transforms = new Array<ImageTransform>(this.urls.length).fill({rotate: 0, flipH: true});
	// 		this.checked = true;
	// 		console.log(this.transforms);
	// 	}
	// }

	async deleteFile(url: string) {
		try {
			this.urls = (await this.http.delete<History>(url).toPromise()).urls.map(url => `${environment.server}/api/${url}`);
		} catch ({ error }) {
			console.error(error);
			this.toast.showToast(error, "danger");
		}
	}

	// finishEdit(event: ImageCroppedEvent) {
	// 	console.log(event.base64);
	// }

	// rotateRight(i: number) {
	// 	this.transforms[i].flipH = !this.transforms[i].flipH;
	// }

}
