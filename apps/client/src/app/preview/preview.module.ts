import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { IonicModule } from "@ionic/angular";
import { ToastService } from "../toast.service";
import { PreviewComponent } from "./preview.component";
import { AuthInterceptor } from "../auth/auth.interceptor";

@NgModule({
	imports: [
		CommonModule,
		RouterModule,
		HttpClientModule,
		IonicModule,
	],
	providers: [
		ToastService,
		{
			provide: HTTP_INTERCEPTORS,
			useClass: AuthInterceptor,
			multi: true
		}
	],
	declarations: [PreviewComponent],
	exports: [PreviewComponent]
}) export class PreviewModule {}
