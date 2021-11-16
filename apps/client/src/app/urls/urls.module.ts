import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { IonicModule } from "@ionic/angular";
// import { AngularCropperjsModule } from "angular-cropperjs";
import { URLsComponent } from "./urls.component";
import { ToastService } from "../toast.service";
import { AuthInterceptor } from "../auth/auth.interceptor";

@NgModule({
	imports: [
		CommonModule,
		HttpClientModule,
		IonicModule,
		// AngularCropperjsModule,
	],
	providers: [
		ToastService,
		{
			provide: HTTP_INTERCEPTORS,
			useClass:AuthInterceptor,
			multi: true
		}
	],
	declarations: [URLsComponent],
	exports: [URLsComponent]
}) export class URLsModule {}
