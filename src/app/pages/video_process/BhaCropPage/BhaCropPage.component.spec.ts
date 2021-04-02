/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { BhaCropPageComponent } from './BhaCropPage.component';


describe('BhaCropPageComponent', () => {
  let component: BhaCropPageComponent;
  let fixture: ComponentFixture<BhaCropPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BhaCropPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BhaCropPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
