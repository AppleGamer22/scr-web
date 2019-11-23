import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouteReuseStrategy, RouterModule } from "@angular/router";
import { HttpClientModule } from "@angular/common/http";
import { FormsModule } from "@angular/forms";
import { ServiceWorkerModule } from "@angular/service-worker";
import { IonicModule, IonicRouteStrategy } from "@ionic/angular";
import { AppComponent } from "./app.component";
import { environment } from "../environments/environment";
import { AppRoutingModule } from "./app-routing.module";
import { ThemeToggleComponent } from "./theme-toggle/theme-toggle.component";
import { ToastService } from "./toast.service";

@NgModule({
	declarations: [
		AppComponent,
		ThemeToggleComponent,
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
		IonicModule.forRoot({scrollAssist: true}),
		AppRoutingModule,
	],
	providers: [
		{
			provide: RouteReuseStrategy,
			useClass: IonicRouteStrategy,
		},
		ToastService
	],
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
	bootstrap: [AppComponent]
}) export class AppModule {}
