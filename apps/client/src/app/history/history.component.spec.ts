import { waitForAsync, ComponentFixture, TestBed } from "@angular/core/testing";
import { IonicModule } from "@ionic/angular";
import { HttpClientModule } from "@angular/common/http";
import { RouterTestingModule } from "@angular/router/testing";
import { FormsModule } from "@angular/forms";
import { URLsModule } from "../urls/urls.module";
import { HistoryComponent } from "./history.component";
import { ToastService } from "../toast.service";

describe("HistoryComponent", () => {
	let component: HistoryComponent;
	let fixture: ComponentFixture<HistoryComponent>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			imports: [
				IonicModule,
				HttpClientModule,
				RouterTestingModule,
				FormsModule,
				URLsModule
			],
			providers: [ToastService],
			declarations: [HistoryComponent],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(HistoryComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => expect(component).toBeTruthy());
});
