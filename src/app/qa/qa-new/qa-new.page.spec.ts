import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QaNewPage } from './qa-new.page';

describe('QaNewPage', () => {
  let component: QaNewPage;
  let fixture: ComponentFixture<QaNewPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QaNewPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QaNewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
