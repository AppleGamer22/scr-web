import { NgModule } from "@angular/core";
import { PreloadAllModules, RouterModule, Routes } from "@angular/router";
import { AppComponent } from "./app.component";
import { InstagramComponent } from "./instagram/instagram.component";
import { HighlightComponent } from "./highlight/highlight.component";
import { StoryComponent } from "./story/story.component";
import { VSCOComponent } from "./vsco/vsco.component";

const routes: Routes = [
	/*{
		path: "",
		component: AppComponent,
	},*/{
		path: "instagram",
		component: InstagramComponent
	},{
		path: "highlight",
		component: HighlightComponent
	},{
		path: "story",
		component: StoryComponent
	},{
		path: "vsco",
		component: VSCOComponent
	}
];

@NgModule({
	imports: [RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules})],
	exports: [RouterModule]
}) export class AppRoutingModule {}
