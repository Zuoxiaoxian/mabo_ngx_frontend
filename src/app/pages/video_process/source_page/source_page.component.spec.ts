/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { Source_pageComponent } from './source_page.component';

describe('Source_pageComponent', () => {
  let component: Source_pageComponent;
  let fixture: ComponentFixture<Source_pageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Source_pageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Source_pageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
