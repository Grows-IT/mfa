import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MachineCalcReportPage } from './machine-calc-report.page';

describe('MachineCalcReportPage', () => {
  let component: MachineCalcReportPage;
  let fixture: ComponentFixture<MachineCalcReportPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MachineCalcReportPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MachineCalcReportPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
