import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FarmVsModernFarmPage } from './farm-vs-modern-farm.page';

describe('FarmVsModernFarmPage', () => {
  let component: FarmVsModernFarmPage;
  let fixture: ComponentFixture<FarmVsModernFarmPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FarmVsModernFarmPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FarmVsModernFarmPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
