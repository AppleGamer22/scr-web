import { TestBed, async } from "@angular/core/testing";
import { HttpClientModule } from "@angular/common/http";
import { RouterTestingModule } from "@angular/router/testing";
import { IonicModule } from "@ionic/angular";
import { AppComponent } from "./app.component";
import { ThemeToggleComponent } from "./theme-toggle/theme-toggle.component";
import { FormsModule } from "@angular/forms";

describe("AppComponent", () => {
	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [
				FormsModule,
				HttpClientModule,
				RouterTestingModule,
				IonicModule.forRoot({scrollAssist: true})
			],
			declarations: [
				AppComponent,
				ThemeToggleComponent
			],
		}).compileComponents();
	}));

	it("should create the app", () => {
		const fixture = TestBed.createComponent(AppComponent);
		const app = fixture.debugElement.componentInstance;
		expect(app).toBeTruthy();
	});
});
