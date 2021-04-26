import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PagesPopusComponent } from './pages-popus.component';

describe('PagesPopusComponent', () => {
  let component: PagesPopusComponent;
  let fixture: ComponentFixture<PagesPopusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PagesPopusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PagesPopusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
