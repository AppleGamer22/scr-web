import { waitForAsync, ComponentFixture, TestBed } from "@angular/core/testing";
import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { IonicModule } from "@ionic/angular";
import { URLsComponent } from "./urls.component";
import { ToastService } from "../toast.service";

describe("URLsComponent", () => {
	let component: URLsComponent;
	let fixture: ComponentFixture<URLsComponent>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [URLsComponent],
			imports: [
				CommonModule,
				HttpClientModule,
				IonicModule
			],
			providers: [ToastService]
		}).compileComponents();

		fixture = TestBed.createComponent(URLsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	}));

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
