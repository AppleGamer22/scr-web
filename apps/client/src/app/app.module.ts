import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouteReuseStrategy } from "@angular/router";
import { HttpClientModule } from "@angular/common/http";
import { FormsModule } from "@angular/forms";
import { ServiceWorkerModule } from "@angular/service-worker";
import { IonicModule, IonicRouteStrategy } from "@ionic/angular";
import { AppComponent } from "./app.component";
import { environment } from "../environments/environment";
import { AppRoutingModule } from "./app-routing.module";
import { ThemeToggleComponent } from "./theme-toggle/theme-toggle.component";
import { InstagramComponent } from "./instagram/instagram.component";
import { VSCOComponent } from "./vsco/vsco.component";
import { HighlightComponent } from './highlight/highlight.component';
import { StoryComponent } from './story/story.component';

@NgModule({
	declarations: [AppComponent, ThemeToggleComponent, InstagramComponent, VSCOComponent, HighlightComponent, StoryComponent],
	imports: [
		BrowserModule,
		FormsModule,
		HttpClientModule,
		ServiceWorkerModule.register("ngsw-worker.js", {enabled: environment.production}),
		IonicModule.forRoot({scrollAssist: true}),
		AppRoutingModule,
	],
	providers: [
		{
			provide: RouteReuseStrategy,
			useClass: IonicRouteStrategy,
		},
	],
	bootstrap: [AppComponent],
}) export class AppModule {}
