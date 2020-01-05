import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { IonicModule } from "@ionic/angular";
import { InstagramComponent } from "./instagram.component";
import { RouterTestingModule } from "@angular/router/testing";

describe("InstagramComponent", () => {
	let component: InstagramComponent;
	let fixture: ComponentFixture<InstagramComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [
				IonicModule.forRoot({scrollAssist: true}),
				FormsModule,
				HttpClientModule,
				RouterTestingModule
			],
			declarations: [InstagramComponent],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(InstagramComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
