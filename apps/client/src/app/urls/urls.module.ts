import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { IonicModule } from "@ionic/angular";
import { AngularCropperjsModule } from "angular-cropperjs";
import { URLsComponent } from "./urls.component";
import { ToastService } from "../toast.service";

@NgModule({
	imports: [
		CommonModule,
		HttpClientModule,
		IonicModule,
		AngularCropperjsModule,
	],
	providers: [ToastService],
	declarations: [URLsComponent],
	exports: [URLsComponent]
}) export class URLsModule {}
