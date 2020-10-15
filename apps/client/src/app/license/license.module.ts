import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { RouterModule } from "@angular/router";
import { IonicModule } from "@ionic/angular";
import { LicenseComponent } from "./license.component";

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		HttpClientModule,
		RouterModule.forChild([{path: "", component: LicenseComponent}]),
		IonicModule
	],
	declarations: [LicenseComponent],
	exports: [LicenseComponent],
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
}) export class LicenseModule {}
