import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubTopicsPage } from './sub-topics.page';

describe('SubTopicsPage', () => {
  let component: SubTopicsPage;
  let fixture: ComponentFixture<SubTopicsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubTopicsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubTopicsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
