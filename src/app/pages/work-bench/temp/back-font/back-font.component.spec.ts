/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { BackFontComponent } from './back-font.component';

describe('BackFontComponent', () => {
  let component: BackFontComponent;
  let fixture: ComponentFixture<BackFontComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BackFontComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BackFontComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
