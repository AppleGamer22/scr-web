import { waitForAsync, ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { IonicModule } from "@ionic/angular";
import { InstagramComponent } from "./instagram.component";
import { RouterTestingModule } from "@angular/router/testing";
import { URLsModule } from "../urls/urls.module";
import { ToastService } from "../toast.service";

describe("InstagramComponent", () => {
	let component: InstagramComponent;
	let fixture: ComponentFixture<InstagramComponent>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			imports: [
				IonicModule,
				FormsModule,
				HttpClientModule,
				RouterTestingModule,
				URLsModule
			],
			providers: [ToastService],
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
