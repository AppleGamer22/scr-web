import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { ThemeToggleComponent } from "./theme-toggle.component";
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

describe("ThemeToggleComponent", () => {
	let component: ThemeToggleComponent;
	let fixture: ComponentFixture<ThemeToggleComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ThemeToggleComponent],
			imports: [
				FormsModule,
				IonicModule.forRoot({scrollAssist: true})
			]
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ThemeToggleComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
