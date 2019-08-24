import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CalculatorsPage } from './calculators.page';

describe('CalculatorsPage', () => {
  let component: CalculatorsPage;
  let fixture: ComponentFixture<CalculatorsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CalculatorsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalculatorsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
