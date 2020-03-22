import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { HttpClientModule } from "@angular/common/http";
import { RouterTestingModule } from "@angular/router/testing";
import { HighlightComponent } from "./highlight.component";
import { ToastService } from "../toast.service";

describe("HighlightComponent", () => {
	let component: HighlightComponent;
	let fixture: ComponentFixture<HighlightComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [
				IonicModule.forRoot({scrollAssist: true}),
				HttpClientModule,
				RouterTestingModule,
				FormsModule
			],
			providers: [ToastService],
			declarations: [HighlightComponent],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(HighlightComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
