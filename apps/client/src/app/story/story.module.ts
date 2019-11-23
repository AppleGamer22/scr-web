import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { RouterModule } from "@angular/router";
import { IonicModule } from "@ionic/angular";
import { StoryComponent } from "./story.component";

@NgModule({
	imports: [
		IonicModule.forRoot({scrollAssist: true}),
		FormsModule,
		CommonModule,
		HttpClientModule,
		RouterModule.forChild([{path: "", component: StoryComponent}])
	],
	declarations: [StoryComponent],
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
}) export class StoryModule {}