import { waitForAsync, ComponentFixture, TestBed } from "@angular/core/testing";
import { IonicModule } from "@ionic/angular";

import { LicenseComponent } from "./license.component";

describe("LicenseComponent", () => {
	let component: LicenseComponent;
	let fixture: ComponentFixture<LicenseComponent>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [LicenseComponent],
			imports: [IonicModule.forRoot()],
		}).compileComponents();

		fixture = TestBed.createComponent(LicenseComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	}));

	it("should create", () => expect(component).toBeTruthy());
});
