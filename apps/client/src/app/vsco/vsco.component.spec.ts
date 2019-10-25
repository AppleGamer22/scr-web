import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { VSCOComponent } from "./vsco.component";

describe("VSCOComponent", () => {
	let component: VSCOComponent;
	let fixture: ComponentFixture<VSCOComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [VSCOComponent],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(VSCOComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
