import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { RouterModule } from "@angular/router";
import { IonicModule } from "@ionic/angular";
import { VSCOComponent } from "./vsco.component";
import { URLsModule } from "../urls/urls.module";
import { AuthInterceptor } from "../auth/auth.interceptor";

@NgModule({
	imports: [
		IonicModule,
		FormsModule,
		CommonModule,
		HttpClientModule,
		RouterModule.forChild([{path: "", component: VSCOComponent}]),
		URLsModule
	],
	providers: [
		{
			provide: HTTP_INTERCEPTORS,
			useClass:AuthInterceptor,
			multi: true
		}
	],
	declarations: [VSCOComponent],
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
}) export class VSCOModule {}