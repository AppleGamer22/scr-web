import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule } from "@angular/forms";
import { RouterTestingModule } from "@angular/router/testing";
import { HttpClientModule } from "@angular/common/http";
import { IonicModule } from "@ionic/angular";
import { VSCOComponent } from "./vsco.component";

describe("VSCOComponent", () => {
	let component: VSCOComponent;
	let fixture: ComponentFixture<VSCOComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [
				IonicModule.forRoot({scrollAssist: true}),
				FormsModule,
				RouterTestingModule,
				HttpClientModule
			],
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
