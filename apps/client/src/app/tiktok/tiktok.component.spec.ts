import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule } from "@angular/forms";
import { RouterTestingModule } from "@angular/router/testing";
import { HttpClientModule } from "@angular/common/http";
import { IonicModule } from "@ionic/angular";
import { TikTokComponent } from "./tiktok.component";

describe("TikTokComponent", () => {
	let component: TikTokComponent;
	let fixture: ComponentFixture<TikTokComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [
				IonicModule.forRoot({scrollAssist: true}),
				FormsModule,
				RouterTestingModule,
				HttpClientModule
			],
			declarations: [TikTokComponent],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(TikTokComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => expect(component).toBeTruthy());
});
