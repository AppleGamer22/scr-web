import { waitForAsync, ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule } from "@angular/forms";
import { RouterTestingModule } from "@angular/router/testing";
import { HttpClientModule } from "@angular/common/http";
import { IonicModule } from "@ionic/angular";
import { TikTokComponent } from "./tiktok.component";
import { ToastService } from "../toast.service";
import { URLsModule } from "../urls/urls.module";

describe("TikTokComponent", () => {
	let component: TikTokComponent;
	let fixture: ComponentFixture<TikTokComponent>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			imports: [
				IonicModule.forRoot({scrollAssist: true}),
				FormsModule,
				RouterTestingModule,
				HttpClientModule,
				URLsModule
			],
			providers: [ToastService],
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
