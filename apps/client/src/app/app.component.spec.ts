import { Component } from "@angular/core";
import { TestBed, async } from "@angular/core/testing";
import { HttpClientModule } from "@angular/common/http";
import { AppComponent } from "./app.component";
import { IonicModule } from '@ionic/angular';

describe("AppComponent", () => {
	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [AppComponent],
			imports: [
				HttpClientModule,
				IonicModule.forRoot({scrollAssist: true})
			],
		}).compileComponents();
	}));

	it("should create the app", () => {
		const fixture = TestBed.createComponent(AppComponent);
		const app = fixture.debugElement.componentInstance;
		expect(app).toBeTruthy();
	});
});
