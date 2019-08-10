import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssessSugarPage } from './assess-sugar.page';

describe('AssessSugarPage', () => {
  let component: AssessSugarPage;
  let fixture: ComponentFixture<AssessSugarPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssessSugarPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssessSugarPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
