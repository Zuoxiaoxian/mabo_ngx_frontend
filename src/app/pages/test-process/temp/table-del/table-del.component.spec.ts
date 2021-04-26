/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { TableDelComponent } from './table-del.component';

describe('TableDelComponent', () => {
  let component: TableDelComponent;
  let fixture: ComponentFixture<TableDelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TableDelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableDelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
