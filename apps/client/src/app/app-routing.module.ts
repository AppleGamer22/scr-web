import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

const routes: Routes = [
	{
		path: "",
		loadChildren: () => import("./auth/auth.module").then(m => m.AuthModule)
	},{
		path: "instagram",
		loadChildren: () => import("./instagram/instagram.module").then(m => m.InstagramModule)
	},{
		path: "highlight",
		loadChildren: () => import("./highlight/highlight.module").then(m => m.HighlightModule)
	},{
		path: "story",
		loadChildren: () => import("./story/story.module").then(m => m.StoryModule)
	},{
		path: "tiktok",
		loadChildren: () => import("./tiktok/tiktok.module").then(m => m.TikTokModule)
	},{
		path: "vsco",
		loadChildren: () => import("./vsco/vsco.module").then(m => m.VSCOModule)
	},{
		path: "history",
		loadChildren: () => import("./history/history.module").then(m => m.HistoryModule)
	}
];

@NgModule({
	imports: [RouterModule.forRoot(routes, {scrollPositionRestoration: "enabled", onSameUrlNavigation: "ignore"})],
	exports: [RouterModule]
}) export class AppRoutingModule {}
