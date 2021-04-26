import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CameraTestVideoComponent } from './camera-test-video.component';

describe('CameraTestVideoComponent', () => {
  let component: CameraTestVideoComponent;
  let fixture: ComponentFixture<CameraTestVideoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CameraTestVideoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CameraTestVideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
