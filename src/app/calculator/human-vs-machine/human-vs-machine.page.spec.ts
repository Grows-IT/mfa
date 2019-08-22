import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HumanVsMachinePage } from './human-vs-machine.page';

describe('HumanVsMachinePage', () => {
  let component: HumanVsMachinePage;
  let fixture: ComponentFixture<HumanVsMachinePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HumanVsMachinePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HumanVsMachinePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
