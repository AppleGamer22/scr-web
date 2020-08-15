import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { IonicModule } from "@ionic/angular";
import { URLsComponent } from "./urls.component";

@NgModule({
	imports: [
		CommonModule,
		IonicModule.forRoot({scrollAssist: true}),
	],
	declarations: [URLsComponent],
	exports: [URLsComponent]
})
export class URLsModule {}
