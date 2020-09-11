import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { IonicModule } from "@ionic/angular";
import { URLsComponent } from "./urls.component";

describe("URLsComponent", () => {
	let component: URLsComponent;
	let fixture: ComponentFixture<URLsComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [URLsComponent],
			imports: [
				IonicModule
			],
		}).compileComponents();

		fixture = TestBed.createComponent(URLsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	}));

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
