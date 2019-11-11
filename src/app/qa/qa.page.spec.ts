import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QaPage } from './qa.page';

describe('QaPage', () => {
  let component: QaPage;
  let fixture: ComponentFixture<QaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QaPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
