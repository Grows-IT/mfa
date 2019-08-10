import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentsPage } from './contents.page';

describe('ContentsPage', () => {
  let component: ContentsPage;
  let fixture: ComponentFixture<ContentsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContentsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
