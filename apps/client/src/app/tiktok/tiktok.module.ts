import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { RouterModule } from "@angular/router";
import { IonicModule } from "@ionic/angular";
import { TikTokComponent } from "./tiktok.component";

@NgModule({
	imports: [
		IonicModule,
		FormsModule,
		CommonModule,
		HttpClientModule,
		RouterModule.forChild([{path: "", component: TikTokComponent}])
	],
	declarations: [TikTokComponent],
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
}) export class TikTokModule {}