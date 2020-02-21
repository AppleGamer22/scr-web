import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TiktokComponent } from './tiktok.component';

describe('TiktokComponent', () => {
  let component: TiktokComponent;
  let fixture: ComponentFixture<TiktokComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TiktokComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TiktokComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
