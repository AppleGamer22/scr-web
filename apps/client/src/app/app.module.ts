import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouteReuseStrategy, RouterModule } from "@angular/router";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { FormsModule } from "@angular/forms";
import { ServiceWorkerModule } from "@angular/service-worker";
import { IonicModule, IonicRouteStrategy } from "@ionic/angular";
import { AppComponent } from "./app.component";
import { environment } from "../environments/environment";
import { AppRoutingModule } from "./app-routing.module";
import { ToastService } from "./toast.service";
import { AuthInterceptor } from "./auth/auth.interceptor";

@NgModule({
	declarations: [
		AppComponent
	],
	imports: [
		BrowserModule,
		FormsModule,
		HttpClientModule,
		RouterModule,
		ServiceWorkerModule.register("ngsw-worker.js", {
			enabled: environment.production,
			registrationStrategy: "registerImmediately"
		}),
		IonicModule.forRoot({scrollAssist: true, mode: "md"}),
		AppRoutingModule,
	],
	providers: [
		{
			provide: RouteReuseStrategy,
			useClass: IonicRouteStrategy,
		},{
			provide: HTTP_INTERCEPTORS,
			useClass:AuthInterceptor,
			multi: true
		},
		ToastService
	],
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
	bootstrap: [AppComponent]
}) export class AppModule {}
