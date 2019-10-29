import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { RouterTestingModule } from "@angular/router/testing";
import { HttpClientModule } from "@angular/common/http";
import { StoryComponent } from "./story.component";

describe("StoryComponent", () => {
	let component: StoryComponent;
	let fixture: ComponentFixture<StoryComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [
				IonicModule.forRoot({scrollAssist: true}),
				FormsModule,
				RouterTestingModule,
				FormsModule,
				HttpClientModule
			],
			declarations: [StoryComponent],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(StoryComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
