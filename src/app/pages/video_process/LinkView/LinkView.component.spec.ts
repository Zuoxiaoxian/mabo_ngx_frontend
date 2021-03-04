/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { LinkViewComponent } from './LinkView.component';

describe('LinkViewComponent', () => {
  let component: LinkViewComponent;
  let fixture: ComponentFixture<LinkViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LinkViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LinkViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
