import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { IonicModule } from "@ionic/angular";
// import { ImageCropperModule } from "ngx-image-cropper";
import { URLsComponent } from "./urls.component";

@NgModule({
	imports: [
		CommonModule,
		HttpClientModule,
		IonicModule,
		// ImageCropperModule
	],
	declarations: [URLsComponent],
	exports: [URLsComponent]
})
export class URLsModule {}
