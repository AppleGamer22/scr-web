import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { RouterModule } from "@angular/router";
import { IonicModule } from "@ionic/angular";
import { HistoryComponent } from "./history.component";
import { URLsModule } from "../urls/urls.module";

@NgModule({
	imports: [
		IonicModule,
		FormsModule,
		CommonModule,
		HttpClientModule,
		RouterModule.forChild([{path: "", component: HistoryComponent}]),
		URLsModule
	],
	declarations: [HistoryComponent],
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
}) export class HistoryModule {}