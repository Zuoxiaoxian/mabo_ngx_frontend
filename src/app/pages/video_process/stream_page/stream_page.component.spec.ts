/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { Stream_pageComponent } from './stream_page.component';

describe('Stream_pageComponent', () => {
  let component: Stream_pageComponent;
  let fixture: ComponentFixture<Stream_pageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Stream_pageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Stream_pageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
