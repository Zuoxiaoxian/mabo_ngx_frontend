import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CameraNewaddComponent } from './camera-newadd.component';

describe('CameraNewaddComponent', () => {
  let component: CameraNewaddComponent;
  let fixture: ComponentFixture<CameraNewaddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CameraNewaddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CameraNewaddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
