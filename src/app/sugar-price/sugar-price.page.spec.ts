import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SugarPricePage } from './sugar-price.page';

describe('SugarPricePage', () => {
  let component: SugarPricePage;
  let fixture: ComponentFixture<SugarPricePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SugarPricePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SugarPricePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
