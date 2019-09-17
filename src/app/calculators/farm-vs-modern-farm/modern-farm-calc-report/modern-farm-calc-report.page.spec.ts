import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModernFarmCalcReportPage } from './modern-farm-calc-report.page';

describe('ModernFarmCalcReportPage', () => {
  let component: ModernFarmCalcReportPage;
  let fixture: ComponentFixture<ModernFarmCalcReportPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModernFarmCalcReportPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModernFarmCalcReportPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
