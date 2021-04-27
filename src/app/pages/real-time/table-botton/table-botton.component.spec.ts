/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { TableBottonComponent } from './table-botton.component';

describe('TableBottonComponent', () => {
  let component: TableBottonComponent;
  let fixture: ComponentFixture<TableBottonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TableBottonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableBottonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
